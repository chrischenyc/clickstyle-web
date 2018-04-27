import { Meteor } from 'meteor/meteor';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Conversations from '../conversations';
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
            updatedAt: 1,
            lastMessageExcerpt: 1,
            lastMessageSender: 1,
          },
          order: {
            updatedAt: -1,
          },
        },
      ).fetch();

      return conversations.map((conversation) => {
        const { name } = Profiles.findOne({
          owner: conversation.lastMessageSender,
        });

        const lastMessageSender =
          conversation.lastMessageSender === this.userId ? 'You' : name.first;

        return { ...conversation, lastMessageSender };
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
