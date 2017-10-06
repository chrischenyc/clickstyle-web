import { Meteor } from 'meteor/meteor';

import Jobs from '../imports/api/Jobs';

Meteor.startup(() => {
  Meteor.publish('jobs', () => Jobs.find({}, { sort: { createdAt: -1 } }));
});
