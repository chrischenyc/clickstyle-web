import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import rateLimit from '../../../modules/server/rate-limit';
import UserContacts from '../user_contacts';
import { sendAdminEmailContactForm } from '../../../modules/server/send-email';

Meteor.methods({
  submitContact: function submitUserContactForm(data) {
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
      sendAdminEmailContactForm(name, email, phone, subject, message);
    });
  },
});

rateLimit({
  methods: ['submitContact'],
  limit: 5,
  timeRange: 1000,
});
