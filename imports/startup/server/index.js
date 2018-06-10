// import server startup through a single index entry point
import { WebApp } from 'meteor/webapp';

import './log';
import './api';
import './oauth';
import './email';
import './accounts';
import './email-templates';
import '../slingshot-restrictions';
import './slingshot-directives';
import './cloudinary';
import './fixtures';

import Profiles from '../../api/profiles/profiles';
import UserStats from '../../api/user_stats/user_stats';

WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));

const userStats = UserStats.find().fetch();
userStats.forEach((stats) => {
  const {
    owner,
    notifications,
    messages,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    declinedBookings,
    completedBookings,
    confirmedCustomerBookings,
    pendingCustomerBookings,
    cancelledCustomerBookings,
    declinedCustomerBookings,
    completedCustomerBookings,
  } = stats;

  Profiles.update(
    { owner },
    {
      $set: {
        notifications,
        messages,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        declinedBookings,
        completedBookings,
        confirmedCustomerBookings,
        pendingCustomerBookings,
        cancelledCustomerBookings,
        declinedCustomerBookings,
        completedCustomerBookings,
      },
    },
  );
});
