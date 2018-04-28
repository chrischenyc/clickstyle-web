import { Meteor } from 'meteor/meteor';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Conversations from '../conversations';
import Messages from '../../messages/messages';
import Profiles from '../../profiles/profiles';

Meteor.methods({
  'conversations.list': function findUserConversations() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    try {
      const conversations = Conversations.find(
        { participants: this.userId },
        {
          fields: {
            booking: 1,
            participants: 1,
          },
          order: {
            updatedAt: -1,
          },
        },
      ).fetch();

      return conversations.map((conversation) => {
        const recipientId = conversation.participants.filter(participant => participant !== this.userId)[0];
        const recipient = Profiles.findOne(
          { owner: recipientId },
          { fields: { name: 1, photo: 1 } },
        );

        let lastMessage = Messages.findOne(
          { conversation: conversation._id },
          {
            sort: { createdAt: -1 },
            fields: {
              sender: 1,
              read: 1,
              content: 1,
              createdAt: 1,
            },
          },
        );

        const sender =
          lastMessage.sender === this.userId
            ? 'You'
            : Profiles.findOne({ owner: lastMessage.sender }).name.first;
        const read = lastMessage.sender === this.userId ? true : lastMessage.read;
        const content = _.truncate(lastMessage.content, { length: 200 });

        lastMessage = {
          ...lastMessage,
          sender,
          read,
          content,
        };

        return { ..._.omit(conversation, 'participants'), recipient, lastMessage };
      });
    } catch (error) {
      log.error(error);
      throw error;
    }
  },
});

rateLimit({
  methods: ['conversations.list'],
  limit: 5,
  timeRange: 1000,
});
