import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
  process.env.MAIL_URL = Meteor.settings.private.MAIL_URL;
}
