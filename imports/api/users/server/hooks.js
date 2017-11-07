import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import { sendWelcomeEmail } from '../../../modules/server/send-email';

Meteor.users.after.insert((userId, user) => {
  // send email verification for email sign-up
  if (user.services.password) {
    Accounts.sendVerificationEmail(user._id);
  }

  // send welcome email regardless sign-up types
  sendWelcomeEmail(user._id);

  // default sign-up role is Customer
  Roles.addUsersToRoles(user._id, [Meteor.settings.public.roles.customer]);
});
