import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Services from '../services';
import Addons from '../../addons/addons';

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
  'services.keywords': function servicesAndAddons(data) {
    check(data, Object);

    try {
      const services = Services.find(
        {},
        { sort: { displayOrder: 1 }, fields: { name: 1 } },
      ).fetch();

      const systemAddons = Addons.find(
        { published: true, createdBy: 'system' },
        {
          fields: {
            name: 1,
            serviceId: 1,
          },
        },
      ).fetch();

      const names = [];

      services.forEach((service) => {
        if (!_.includes(names, service.name)) {
          names.push(service.name);
        }

        systemAddons.filter(addon => addon.serviceId === service._id).forEach((addon) => {
          if (!_.includes(names, addon.name)) {
            names.push(addon.name);
          }
        });
      });

      return names;
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['featured.home.services', 'services.keywords'],
  limit: 5,
  timeRange: 1000,
});
