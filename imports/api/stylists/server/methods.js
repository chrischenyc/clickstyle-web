import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../stylists';
import Addons from '../../addons/addons';
import Profiles from '../../profiles/profiles';
import Suburbs from '../../suburbs/suburbs';
import { SearchLimit } from '../../../modules/server/constants';
import coordinatesDistance from '../../../modules/server/coordinates-distance';

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

  'stylists.update.areas': function updateStylistsAreas(areas) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(areas, Object);

    try {
      Stylists.update({ owner: this.userId }, { $set: { areas } });

      // calculate suburbs within reach
      Meteor.defer(() => {
        const selectedSuburb = Suburbs.findOne({ _id: areas.suburb._id });
        const availableSuburbs = Suburbs.find({ active: true, state: selectedSuburb.state })
          .fetch()
          .filter(suburb =>
            coordinatesDistance(selectedSuburb.lat, selectedSuburb.lon, suburb.lat, suburb.lon) <=
              areas.radius);

        Stylists.update(
          { owner: this.userId },
          { $set: { 'areas.availableSuburbs': availableSuburbs } },
        );
      });

      log.info(
        'Meteor.methods: stylists.update.areas',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(areas)}`,
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

    const { service, suburb, offset } = data;
    check(service, String);
    if (suburb) {
      check(suburb, String);
    }
    check(offset, Number);

    try {
      // break down service name into words,
      // match with names of services and their subordinate addons
      // sample conversion: "full-face-makeup" -> "/full.+face.+makeup/i"
      const keywords = service.split('-').filter(word => word !== 'and');
      let regex = '';
      for (let index = 0; index < keywords.length; index += 1) {
        regex += keywords[index];
        if (index < keywords.length - 1) {
          regex += '.+';
        }
      }

      const serviceNameSelector = { 'services.name': RegExp(regex, 'i') };
      const addonNameSelector = {
        'services.addons.name': RegExp(regex, 'i'),
      };

      // TODO: query by suburb

      // final compose
      const selector = {
        public: true,
        $or: [serviceNameSelector, addonNameSelector],
      };

      const stylists = Stylists.find(selector, {
        fields: { owner: 1, services: 1 },
        limit: SearchLimit,
        skip: offset,
      }).fetch();

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

      return {
        stylists: stylists.map((stylist) => {
          const filteredProfiles = profiles.filter(profile => profile.owner === stylist.owner);

          return {
            ...stylist,
            profile: filteredProfiles.length > 0 && filteredProfiles[0],
          };
        }),
        hasMore: stylists.length >= SearchLimit,
      };
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: [
    'stylists.update.services',
    'stylists.update.openHours',
    'stylists.update.areas',
    'stylists.search',
  ],
  limit: 5,
  timeRange: 1000,
});
