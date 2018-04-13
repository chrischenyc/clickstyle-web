import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import _ from 'lodash';
import moment from 'moment';

import rateLimit from '../../../modules/server/rate-limit';
import { sendPasswordChangedEmail } from '../../../modules/server/send-email';
import { dateTimeShortString } from '../../../modules/format-date';
import Bookings from '../../bookings/bookings';
import Profiles from '../../profiles/profiles';

function bookingSummary(booking, userId) {
  if (booking.customer === userId) {
    const { name: stylistName } = Profiles.findOne({ owner: booking.stylist });

    return `You have booked ${stylistName.first} ${stylistName.last} on ${dateTimeShortString(booking.time)}`;
  }

  return `${booking.firstName} ${booking.lastName} has booked you on ${dateTimeShortString(booking.time)}`;
}

function bookingLink(booking, userId) {
  if (booking.customer === userId) {
    return `/users/bookings/${booking._id}`;
  }

  return `/users/stylist/bookings/${booking._id}`;
}

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

    const messages = [];

    // TODO: retrieve unread messages
    messages.push({
      type: 'success',
      content: 'Your booking 13d213 has been confirmed by Ian!',
      link: '/users/bookings/ddd',
    });
    messages.push({
      type: 'warning',
      content: 'Your booking abc33lkf has been cancelled by James!',
      link: '/users/bookings/ddd',
    });
    messages.push({
      type: 'error',
      content: 'Please setup your services and prices',
      link: '/users/bookings/ddd',
    });

    const activities = [];

    // TODO: retrieve recent activities
    activities.push({
      type: 'booking',
      content: 'Your booking has been confirmed!',
      link: '/users/bookings/ddd',
    });
    activities.push({
      type: 'review',
      content: 'Someone left you a review',
      link: '/users/bookings/ddd',
    });

    return {
      messages,
      activities,
    };
  },

  'users.bookings.upcoming': function usersUpcomingBookings() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    const bookings = Bookings.find(
      {
        status: 'confirmed',
        time: {
          $gte: new Date(),
          $lte: moment()
            .add(7, 'days')
            .toDate(),
        },
        $or: [{ customer: this.userId }, { stylist: this.userId }],
      },
      {
        fields: {
          time: 1,
          customer: 1,
          stylist: 1,
          firstName: 1,
          lastName: 1,
        },
        sort: { time: 1 },
      },
    )
      .fetch()
      .map(booking => ({
        ..._.omit(booking, ['time', 'customer', 'stylist', 'firstName', 'lastName']),
        content: bookingSummary(booking, this.userId),
        link: bookingLink(booking, this.userId),
      }));

    return bookings;
  },
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
    'users.sendPasswordChangedEmail',
    'users.dashboard',
    'users.bookings.upcoming',
  ],
  limit: 5,
  timeRange: 1000,
});
