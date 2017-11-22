import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../stylists';
import Addons from '../../addons/addons';
import Profiles from '../../profiles/profiles';

Meteor.methods({
  'stylists.update.services': function updateStylistsServices(services) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(services, Array);

    try {
      Stylists.update({ owner: this.userId }, { $set: { services, public: true } });

      // insert user-defined addons
      Meteor.defer(() => {
        services.forEach((service) => {
          const addonNames = service.addons.map(addon => addon.name);
          const publicAddonNames = Addons.find({ serviceId: service._id })
            .fetch()
            .map(addon => addon.name);
          const newAddonNames = _.differenceWith(addonNames, publicAddonNames, [
            (arrVal, othVal) => _.isEqual(arrVal.toLowerCase(), othVal.toLowerCase()),
          ]);

          newAddonNames.forEach((name) => {
            Addons.insert({
              serviceId: service._id,
              name,
              createdBy: this.userId,
              public: false,
            });
          });
        });
      });

      log.info(
        'Meteor.methods: stylists.update.services',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(services)}`,
      );
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'stylists.update.openHours': function updateStylistsOpenHours(openHours) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(openHours, Array);

    try {
      Stylists.update({ owner: this.userId }, { $set: { openHours } });

      log.info(
        'Meteor.methods: stylists.update.openHours',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(openHours)}`,
      );
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'stylists.search': function searchStylists(data) {
    check(data, Object);
    const { service } = data;
    check(service, String);

    try {
      log.info(
        'Meteor.methods: stylists.search',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(data)}`,
      );

      const stylists = Stylists.find(
        { public: true },
        { fields: { owner: 1, services: 1 } },
      ).fetch();

      const userIds = stylists.map(stylist => stylist.owner);

      const profiles = Profiles.find(
        { owner: { $in: userIds } },
        {
          fields: {
            owner: 1,
            name: 1,
            address: 1,
            photo: 1,
            products: 1,
          },
        },
      ).fetch();

      return stylists.map((stylist) => {
        const filteredProfiles = profiles.filter(profile => profile.owner === stylist.owner);

        return {
          ...stylist,
          profile: filteredProfiles.length > 0 && filteredProfiles[0],
        };
      });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['stylists.update.services', 'stylists.update.openHours', 'stylists.search'],
  limit: 5,
  timeRange: 1000,
});
