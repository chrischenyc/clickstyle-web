import { Meteor } from 'meteor/meteor';

import Jobs from '../imports/api/Jobs';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.publish('jobs', () => Jobs.find({}, { sort: { createdAt: -1 } }));
});
