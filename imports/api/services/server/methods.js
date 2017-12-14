import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Services from '../services';

Meteor.methods({
  'featured.home.services': function searchFeaturedServicesOnHome(data) {
    check(data, Object);

    const { suburb: suburbName } = data;
    if (suburbName) {
      check(suburbName, String);
    }

    try {
      const selector = {};

      if (suburbName) {
        // TODO: alter services selector to be location based
      }

      return Services.find(selector, { sort: { displayOrder: 1 } }).fetch();
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['featured.home.services'],
  limit: 5,
  timeRange: 1000,
});
