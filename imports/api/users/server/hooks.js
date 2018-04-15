import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { sendWelcomeEmail } from '../../../modules/server/send-email';
import subscribeToList from '../../../modules/server/mail_chimp';
import UserStats from '../../user_stats/user_stats';

Meteor.users.after.insert((userId, user) => {
  // default sign-up role is Customer
  Roles.addUsersToRoles(user._id, [Meteor.settings.public.roles.customer]);

  // init user stats
  UserStats.insert({
    owner: user._id,
    notifications: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    declinedBookings: 0,
    completedBookings: 0,
    confirmedCustomerBookings: 0,
    pendingCustomerBookings: 0,
    declinedCustomerBookings: 0,
    completedCustomerBookings: 0,
  });

  // send email verification for email sign-up
  if (user.services.password) {
    Accounts.sendVerificationEmail(user._id);
  }

  // send welcome email regardless sign-up types
  sendWelcomeEmail(user._id);

  // subscribe user to MailChimp
  subscribeToList(user._id, Meteor.settings.MailChimpListId);
});
