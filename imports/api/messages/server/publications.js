import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import Messages from '../messages';
import Conversations from '../../conversations/conversations';

Meteor.publish('conversation.messages', function findConversationMessages(booking) {
  if (!this.userId) {
    throw new Meteor.Error('403');
  }

  check(booking, String);

  try {
    const { _id: conversation } = Conversations.findOne({
      booking,
      participants: this.userId,
    });

    if (!conversation) {
      throw new Meteor.Error('403');
    }

    return Messages.find(
      { conversation },
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
