import { Meteor } from 'meteor/meteor';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Notifications from '../../notifications/notifications';

Meteor.methods({
  'notifications.list': function listUserNotifications() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const notifications = Notifications.find(
        { recipient: this.userId, dismissed: false },
        { sort: { createdAt: -1 }, fields: { dismissed: 0 } },
      ).fetch();

      return notifications;
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['notifications.list'],
  limit: 5,
  timeRange: 1000,
});
