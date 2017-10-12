import { Meteor } from 'meteor/meteor';

// production server reads MAIL_URL from env
if (Meteor.isDevelopment) {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
}
