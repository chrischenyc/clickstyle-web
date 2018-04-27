import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';

import Conversations from '../../conversations/conversations';
import Messages from '../messages';
import Bookings from '../../bookings/bookings';

Meteor.methods({
  'messages.create': function createMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    check(message, Object);
    const { booking, recipient, content } = message;
    check(booking, String);
    check(recipient, String);
    check(content, String);

    try {
      // validate current user and recipient both belong to the booking
      const {
        _id, conversation, customer, stylist,
      } = Bookings.findOne({
        _id: booking,
        $or: [
          { customer: this.userId, stylist: recipient },
          { stylist: this.userId, customer: recipient },
        ],
      });

      if (!_id) {
        throw new Meteor.Error('403');
      }

      // create a new Conversations if none is attached to Booking
      let conversationId = conversation;
      if (!conversationId) {
        conversationId = Conversations.insert({ booking, participants: [customer, stylist] });

        Bookings.update({ _id: booking }, { $set: { conversation: conversationId } });
      }

      // create Messages record
      Messages.insert({
        conversation: conversationId,
        content,
        sender: this.userId,
        recipient,
        read: false,
      });
    } catch (error) {
      log.error(error);
      throw error;
    }
  },
});

rateLimit({
  methods: ['messages.create'],
  limit: 5,
  timeRange: 1000,
});
