import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import Bookings from '../../bookings/bookings';
import Conversations from '../../conversations/conversations';
import Messages from '../messages';

Meteor.publish('conversation.messages', function findConversationMessages(booking) {
  if (!this.userId) {
    throw new Meteor.Error('403');
  }

  check(booking, String);

  try {
    const { customer, stylist } = Bookings.findOne({
      _id: booking,
      $or: [{ customer: this.userId }, { stylist: this.userId }],
    });
    if (!customer || !stylist) {
      throw new Meteor.Error('403');
    }

    const conversation = Conversations.findOne({
      booking,
      participants: this.userId,
    });

    if (!conversation) {
      throw new Meteor.Error('No conversation');
    }

    return Messages.find(
      { conversation: conversation._id },
      {
        sort: {
          createdAt: 1,
        },
        // TODO: pagination
        fields: {
          sender: 1,
          read: 1,
          content: 1,
          createdAt: 1,
        },
      },
    );
  } catch (error) {
    log.error(error);
    throw error;
  }
});
