import { Meteor } from 'meteor/meteor';
import StylistApplications from '../stylist_applications';

Meteor.publish('stylists.application', function stylistsApplication() {
  if (!this.userId) {
    return null;
  }

  return StylistApplications.find({ userId: this.userId });
});
