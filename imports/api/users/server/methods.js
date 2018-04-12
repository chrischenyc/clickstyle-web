import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import rateLimit from '../../../modules/server/rate-limit';
import { sendPasswordChangedEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'users.sendVerificationEmail': function usersSendVerificationEmail() {
    return Accounts.sendVerificationEmail(this.userId);
  },

  'users.sendPasswordChangedEmail': function usersSendPasswordChangedEmail() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    sendPasswordChangedEmail(this.userId);
  },

  'users.dashboardContent': function usersDashboardContent() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    const messages = [
      {
        type: 'success',
        content: 'Your booking has been confirmed!',
        link: '/users/bookings/ddd',
      },
      {
        type: 'error',
        content: 'Your booking has been cancelled!',
        link: '/users/bookings/ddd',
      },
      {
        type: 'warning',
        content: 'Your booking is pending for confirm!',
        link: '/users/bookings/ddd',
      },
    ];

    const activities = [
      {
        type: 'booking',
        content: 'Your booking has been confirmed!',
        link: '/users/bookings/ddd',
      },
      {
        type: 'review',
        content: 'Someone left you a review',
        link: '/users/bookings/ddd',
      },
    ];

    const bookings = [
      {
        content: 'Your booking has been confirmed!',
        link: '/users/bookings/ddd',
      },
      {
        content: 'Your booking has been cancelled!',
        link: '/users/bookings/ddd',
      },
    ];

    return {
      messages,
      activities,
      bookings,
    };
  },
});

rateLimit({
  methods: ['users.sendVerificationEmail', 'users.sendPasswordChangedEmail', 'users.dashboard'],
  limit: 5,
  timeRange: 1000,
});
