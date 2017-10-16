import { Meteor } from 'meteor/meteor';
import rateLimit from '../../../modules/server/rate-limit';
import { sendPasswordChangedEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'users.sendPasswordChangedEmail': function usersSendPasswordChangedEmail() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    const user = Meteor.users.findOne(this.userId);
    if (!user || user.emails.count === 0) {
      throw new Meteor.Error('403');
    }

    sendPasswordChangedEmail(user.emails[0].address, user.profile.name.first);
  },
});

rateLimit({
  methods: ['users.sendPasswordChangedEmail'],
  limit: 5,
  timeRange: 1000,
});
