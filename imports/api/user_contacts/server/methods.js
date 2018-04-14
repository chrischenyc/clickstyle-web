import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import rateLimit from '../../../modules/server/rate-limit';
import UserContacts from '../user_contacts';
import { sendAdminContactFormEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'userContacts.create': function submitUserContactForm(data) {
    check(data, Object);

    const {
      name, email, phone, subject, message, suggestStylist,
    } = data;
    if (name) {
      check(name, String);
    }
    if (email) {
      check(email, String);
    }
    if (phone) {
      check(phone, String);
    }
    if (subject) {
      check(subject, String);
    }
    if (message) {
      check(message, String);
    }
    if (suggestStylist) {
      check(suggestStylist, Boolean);
    }

    const userId = this.userId;

    UserContacts.insert({
      userId,
      name,
      email,
      phone,
      subject,
      message,
      suggestStylist,
    });

    Meteor.defer(() => {
      sendAdminContactFormEmail(name, email, phone, subject, message);
    });
  },
});

rateLimit({
  methods: ['userContacts.create'],
  limit: 5,
  timeRange: 1000,
});
