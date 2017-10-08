import { Meteor } from 'meteor/meteor';

import '../imports/startup/server/fixtures';
import Bookings from '../imports/api/Bookings';

Meteor.startup(() => {
  Meteor.publish('bookings', () => Bookings.find({}, { sort: { createdAt: -1 } }));
  Meteor.publish('booking', id => Bookings.find({ _id: id }));
});
