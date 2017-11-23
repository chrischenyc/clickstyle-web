import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import { sendWelcomeEmail } from '../../../modules/server/send-email';
import subscribeToList from '../../../modules/server/mail_chimp';

Meteor.users.after.insert((userId, user) => {
  // default sign-up role is Customer
  Roles.addUsersToRoles(user._id, [Meteor.settings.public.roles.customer]);

  // send email verification for email sign-up
  if (user.services.password) {
    Accounts.sendVerificationEmail(user._id);
  }

  // send welcome email regardless sign-up types
  sendWelcomeEmail(user._id);

  // subscribe user to MailChimp
  subscribeToList(user._id, Meteor.settings.MailChimpListId);

  log.info('Meteor.methods: users.after.insert', `userId: ${user._id}`);
});
