import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Suburbs from '../suburbs';

Meteor.methods({
  'suburbs.search.published': function searchStylists(keyword) {
    check(keyword, String);

    try {
      const nameSelector = { active: true, published: true, name: RegExp(`^${keyword}`, 'i') };
      const postcodeSelector = {
        active: true,
        published: true,
        postcode: RegExp(`^${keyword}`, 'i'),
      };

      return Suburbs.find(!isNaN(keyword) ? postcodeSelector : nameSelector, {
        fields: { name: 1, postcode: 1 },
        sort: { postcode: 1 },
      }).fetch();
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

Meteor.methods({
  'suburbs.search.all': function searchStylists(keyword) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(keyword, String);

    try {
      const nameSelector = { active: true, name: RegExp(`^${keyword}`, 'i') };
      const postcodeSelector = { active: true, postcode: RegExp(`^${keyword}`, 'i') };

      return Suburbs.find(!isNaN(keyword) ? postcodeSelector : nameSelector, {
        fields: {
          name: 1,
          postcode: 1,
        },
        sort: { postcode: 1 },
      }).fetch();
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['suburbs.search.published', 'suburbs.search.all'],
  limit: 5,
  timeRange: 1000,
});
