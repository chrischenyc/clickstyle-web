import { Meteor } from 'meteor/meteor';

import '../imports/startup/server/index';
import Bookings from '../imports/api/bookings/bookings';

Meteor.publish('bookings', () => Bookings.find({}, { sort: { createdAt: -1 } }));
Meteor.publish('booking', id => Bookings.find({ _id: id }));

Meteor.startup(() => {});
