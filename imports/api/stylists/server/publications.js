import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import Stylists from '../stylists';

Meteor.publish('stylists.owner', function stylistsOwner() {
  if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  return Stylists.find({ owner: this.userId });
});
