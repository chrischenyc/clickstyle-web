import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Notifications from '../../notifications/notifications';
import Profiles from '../../profiles/profiles';

Meteor.methods({
  'notifications.create': function createNotifications(notification) {
    if (
      Meteor.isClient &&
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(notification, Object);

    try {
      Notifications.insert(notification);

      Profiles.update({ owner: notification.recipient }, { $inc: { notifications: 1 } });
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

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

  'notifications.dismiss': function dismissUserNotification(_id) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(_id, String);

    try {
      Notifications.update(
        { _id, recipient: this.userId, dismissible: true },
        {
          $set: {
            dismissed: true,
          },
        },
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['notifications.list', 'notifications.dismiss'],
  limit: 5,
  timeRange: 1000,
});
