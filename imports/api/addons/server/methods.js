import { Meteor } from 'meteor/meteor';

import rateLimit from '../../../modules/server/rate-limit';

import Addons from '../addons';

Meteor.methods({
  'addons.list.published': function findAllServices() {
    return Addons.find(
      { published: true },
      {
        fields: {
          serviceId: 1,
          name: 1,
          duration: 1,
        },
      },
    ).fetch();
  },
});

rateLimit({
  methods: ['addons.list.published'],
  limit: 5,
  timeRange: 1000,
});
