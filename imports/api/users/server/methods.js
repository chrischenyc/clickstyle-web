import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

import rateLimit from '../../../modules/server/rate-limit';
import { sendPasswordChangedEmail } from '../../../modules/server/send-email';
import Bookings from '../../bookings/bookings';

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

  'users.stats': function fetchUserStats() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    // TODO: query all tables just to get counts could be expensive, consider create a UserStats table

    let stats = {
      notifications: 3,
      messages: 5,
    };

    // TODO: query notifications and messages

    const bookings = Bookings.find(
      {
        customer: this.userId,
      },
      { fields: { status: 1 } },
    ).fetch();

    stats = {
      ...stats,
      confirmedBookings: bookings.filter(booking => booking.status === 'confirmed').length,
      pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
      cancelledBookings: bookings.filter(booking => booking.status === 'cancelled').length,
      declinedBookings: bookings.filter(booking => booking.status === 'declined').length,
      completedBookings: bookings.filter(booking => booking.status === 'completed').length,
    };

    if (Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      const customerBookings = Bookings.find(
        {
          stylist: this.userId,
        },
        { fields: { status: 1 } },
      ).fetch();

      stats = {
        ...stats,
        confirmedCustomerBookings: customerBookings.filter(booking => booking.status === 'confirmed').length,
        pendingCustomerBookings: customerBookings.filter(booking => booking.status === 'pending')
          .length,
        cancelledCustomerBookings: customerBookings.filter(booking => booking.status === 'cancelled').length,
        declinedCustomerBookings: customerBookings.filter(booking => booking.status === 'declined')
          .length,
        completedCustomerBookings: customerBookings.filter(booking => booking.status === 'completed').length,
      };
    }

    return stats;
  },
});

rateLimit({
  methods: ['users.sendVerificationEmail', 'users.sendPasswordChangedEmail', 'users.stats'],
  limit: 5,
  timeRange: 1000,
});
