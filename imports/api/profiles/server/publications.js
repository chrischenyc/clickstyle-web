import { Meteor } from 'meteor/meteor';
import Profiles from '../profiles';

Meteor.publish('profiles.self', function profilesOwner() {
  if (!this.userId) {
    return null;
  }

  return Profiles.find(
    { owner: this.userId },
    {
      fields: {
        owner: 1,
        email: 1,
        name: 1,
        mobile: 1,
        address: 1,
        photo: 1,
        about: 1,
        products: 1,
        stripeDefaultCardId: 1,
        stripeDefaultCardLast4: 1,
        stripeDefaultCardName: 1,
        notifications: 1,
        confirmedBookings: 1,
        pendingBookings: 1,
        cancelledBookings: 1,
        declinedBookings: 1,
        completedBookings: 1,
        confirmedCustomerBookings: 1,
        pendingCustomerBookings: 1,
        cancelledCustomerBookings: 1,
        declinedCustomerBookings: 1,
        completedCustomerBookings: 1,
      },
    },
  );
});
