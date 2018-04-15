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
});

rateLimit({
  methods: ['users.sendVerificationEmail', 'users.sendPasswordChangedEmail'],
  limit: 5,
  timeRange: 1000,
});
