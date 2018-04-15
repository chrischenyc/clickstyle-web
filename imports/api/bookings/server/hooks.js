import Bookings from '../bookings';
import UserStats from '../../user_stats/user_stats';

Bookings.after.insert((userId, booking) => {
  UserStats.update({ owner: booking.customer }, { $inc: { pendingBookings: 1 } });
  UserStats.update({ owner: booking.stylist }, { $inc: { pendingCustomerBookings: 1 } });
});

Bookings.after.update((userId, booking, fieldNames, modifier) => {
  if (modifier.$set && modifier.$set.status) {
    if (modifier.$set.status === 'confirmed') {
      UserStats.update(
        { owner: booking.customer },
        { $inc: { pendingBookings: -1, confirmedBookings: 1 } },
      );
      UserStats.update(
        { owner: booking.stylist },
        { $inc: { pendingCustomerBookings: -1, confirmedCustomerBookings: 1 } },
      );
    } else if (modifier.$set.status === 'declined') {
      UserStats.update(
        { owner: booking.customer },
        { $inc: { pendingBookings: -1, declinedBookings: 1 } },
      );
      UserStats.update(
        { owner: booking.stylist },
        { $inc: { pendingCustomerBookings: -1, declinedCustomerBookings: 1 } },
      );
    } else if (modifier.$set.status === 'cancelled') {
      if (booking.stylistConfirmedAt) {
        UserStats.update(
          { owner: booking.customer },
          { $inc: { confirmedBookings: -1, cancelledBookings: 1 } },
        );
        UserStats.update(
          { owner: booking.stylist },
          { $inc: { confirmedCustomerBookings: -1, cancelledCustomerBookings: 1 } },
        );
      } else {
        UserStats.update(
          { owner: booking.customer },
          { $inc: { pendingBookings: -1, cancelledBookings: 1 } },
        );
        UserStats.update(
          { owner: booking.stylist },
          { $inc: { pendingCustomerBookings: -1, cancelledCustomerBookings: 1 } },
        );
      }
    } else if (modifier.$set.status === 'completed') {
      UserStats.update(
        { owner: booking.customer },
        { $inc: { confirmedBookings: -1, completedBookings: 1 } },
      );
      UserStats.update(
        { owner: booking.stylist },
        { $inc: { confirmedCustomerBookings: -1, completedCustomerBookings: 1 } },
      );
    }
  }
});
