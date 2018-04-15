import { Meteor } from 'meteor/meteor';

import UserStats from '../user_stats';

Meteor.publish('userStats', function findUserStats() {
  if (!this.userId) {
    throw new Meteor.Error('403');
  }

  return UserStats.find(
    { owner: this.userId },
    {
      fields: {
        owner: 1,
        notifications: 1,
        confirmedBookings: 1,
        pendingBookings: 1,
        cancelledBookings: 1,
        declinedBookings: 1,
        completedBookings: 1,
        confirmedCustomerBookings: 1,
        pendingCustomerBookings: 1,
        declinedCustomerBookings: 1,
        completedCustomerBookings: 1,
      },
    },
  );
});
