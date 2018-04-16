import '../../api/addons/server/methods';
import '../../api/booking_activities/server/methods';
import '../../api/bookings/server/hooks';
import '../../api/bookings/server/methods';
import '../../api/featured/server/methods';
import '../../api/notifications/server/hooks';
import '../../api/notifications/server/methods';
import '../../api/products/server/methods';
import '../../api/profiles/server/methods';
import '../../api/reviews/server/methods';
import '../../api/services/server/methods';
import '../../api/stylist_applications/server/methods';
import '../../api/stylists/server/methods';
import '../../api/suburbs/server/methods';
import '../../api/user_contacts/server/methods';
import '../../api/user_stats/server/publications';
import '../../api/users/server/methods';
import '../../api/users/server/hooks';

import UserStats from '../../api/user_stats/user_stats';
import Bookings from '../../api/bookings/bookings';
import Notifications from '../../api/notifications/notifications';

Meteor.users
  .find({})
  .fetch()
  .forEach((user) => {
    const bookings = Bookings.find(
      {
        customer: user._id,
      },
      { fields: { status: 1 } },
    ).fetch();

    const customerBookings = Bookings.find(
      {
        stylist: user._id,
      },
      { fields: { status: 1 } },
    ).fetch();

    const notifications = Notifications.find({ recipient: user._id, dismissed: false }).fetch();

    UserStats.upsert(
      { owner: user._id },
      {
        $set: {
          owner: user._id,
          notifications: notifications.length,
          messages: 0,
          confirmedBookings: bookings.filter(booking => booking.status === 'confirmed').length,
          pendingBookings: bookings.filter(booking => booking.status === 'pending').length,
          cancelledBookings: bookings.filter(booking => booking.status === 'cancelled').length,
          declinedBookings: bookings.filter(booking => booking.status === 'declined').length,
          completedBookings: bookings.filter(booking => booking.status === 'completed').length,
          confirmedCustomerBookings: customerBookings.filter(booking => booking.status === 'confirmed').length,
          pendingCustomerBookings: customerBookings.filter(booking => booking.status === 'pending')
            .length,
          cancelledCustomerBookings: customerBookings.filter(booking => booking.status === 'cancelled').length,
          declinedCustomerBookings: customerBookings.filter(booking => booking.status === 'declined').length,
          completedCustomerBookings: customerBookings.filter(booking => booking.status === 'completed').length,
        },
      },
    );
  });
