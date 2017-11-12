import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Stylists from '../stylists';

Meteor.publish('stylists.owner', function stylistsOwner() {
  if (!this.userId) {
    return null;
  }

  return Stylists.find({ owner: this.userId });
});

Meteor.publish('stylists', function stylists(owner) {
  check(owner, String);

  if (!this.userId) {
    return null;
  }

  return Stylists.find({ owner });
});
