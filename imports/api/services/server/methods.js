import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Services from '../services';
import Addons from '../../addons/addons';

Meteor.methods({
  'services.list': function findAllServices() {
    return Services.find(
      {},
      { sort: { displayOrder: 1 }, fields: { name: 1, duration: 1 } },
    ).fetch();
  },

  'services.homeFeatured': function featuredServicesOnHome(data) {
    check(data, Object);

    const { suburb: suburbName } = data;
    if (suburbName) {
      check(suburbName, String);
    }

    try {
      const selector = {};

      if (suburbName) {
        // TODO: services selector to be location based
      }

      return Services.find(selector, {
        sort: { displayOrder: 1 },
        fields: { name: 1, photo: 1 },
      }).fetch();
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'services.searchKeywords': function servicesAndAddons() {
    try {
      const services = Services.find(
        {},
        { sort: { displayOrder: 1 }, fields: { name: 1, duration: 1 } },
      ).fetch();

      const systemAddons = Addons.find(
        { published: true, createdBy: 'system' },
        {
          fields: {
            name: 1,
            serviceId: 1,
            duration: 1,
          },
        },
      ).fetch();

      const values = [];

      services.forEach((service) => {
        if (values.filter(value => value.title === service.name).length === 0) {
          values.push({ title: service.name, duration: service.duration });
        }

        systemAddons.filter(addon => addon.serviceId === service._id).forEach((addon) => {
          if (values.filter(value => value.title === addon.name).length === 0) {
            values.push({ title: addon.name, duration: addon.duration });
          }
        });
      });

      return values;
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['services.list', 'services.homeFeatured', 'services.searchKeywords'],
  limit: 5,
  timeRange: 1000,
});
