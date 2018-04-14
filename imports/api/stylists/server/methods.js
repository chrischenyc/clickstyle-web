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
import coordinatesDistance from '../../../modules/server/coordinates-distance';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';
import updateStylistOccupiedTimeSlots from '../../../modules/server/update-stylist-occupied-timeslots';

import searchStylists from './search-method';

Meteor.methods({
  'stylists.services': function stylistsOwnerServices() {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    return Stylists.findOne({ owner: this.userId }, { fields: { services: 1 } }).services;
  },

  'stylists.services.update': function updateStylistsServices(services) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(services, Array);

    try {
      Stylists.update({ owner: this.userId }, { $set: { services, published: true } });

      // insert user-defined addons
      Meteor.defer(() => {
        services.forEach((service) => {
          const publicAddons = Addons.find({ serviceId: service._id }).fetch();
          const newAddons = _.differenceWith(service.addons, publicAddons, [
            (arrVal, othVal) => _.isEqual(arrVal.name.toLowerCase(), othVal.name.toLowerCase()),
          ]);

          newAddons.forEach((addon) => {
            Addons.insert({
              serviceId: service._id,
              name: addon.name,
              duration: addon.duration,
              createdBy: this.userId,
              published: false,
            });
          });
        });
      });

      // remove notification which reminds stylist to setup services
      Meteor.call('notifications.remove', {
        recipient: this.userId,
        link: '/users/stylist/services',
      });

      log.info(
        'Meteor.methods: stylists.update.services',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(services)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylists.openHours': function stylistsOwnerOpenHours() {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    return Stylists.findOne({ owner: this.userId }, { fields: { openHours: 1 } }).openHours;
  },

  'stylists.openHours.update': function updateStylistsOpenHours(openHours) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(openHours, Array);

    try {
      Stylists.update({ owner: this.userId }, { $set: { openHours } });
      updateStylistOccupiedTimeSlots(this.userId, 90);

      // remove notification which reminds stylist to setup services
      Meteor.call('notifications.remove', {
        recipient: this.userId,
        link: '/users/stylist/calendar',
      });

      log.info(
        'Meteor.methods: stylists.update.openHours',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(openHours)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylists.areas': function stylistsOwner() {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    return Stylists.findOne({ owner: this.userId }, { fields: { areas: 1 } }).areas;
  },

  'stylists.areas.update': function updateStylistsAreas(areas) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(areas, Object);

    try {
      Stylists.update({ owner: this.userId }, { $set: { areas } });

      // remove notification which reminds stylist to setup services
      Meteor.call('notifications.remove', {
        recipient: this.userId,
        link: '/users/stylist/areas',
      });

      // calculate suburbs within reach
      Meteor.defer(() => {
        let availableSuburbs = [];
        const selectedSuburb = Suburbs.findOne({ _id: areas.suburb._id, active: true });

        if (areas.canTravel) {
          availableSuburbs = Suburbs.find(
            { active: true, state: selectedSuburb.state },
            { fields: { _id: 1 } },
          ).fetch();
        } else {
          availableSuburbs = Suburbs.find(
            { active: true, state: selectedSuburb.state },
            { fields: { lat: 1, lon: 1 } },
          )
            .fetch()
            .filter((suburb) => {
              const distance = coordinatesDistance(
                selectedSuburb.lat,
                selectedSuburb.lon,
                suburb.lat,
                suburb.lon,
              );

              return distance <= areas.radius;
            });
        }

        availableSuburbs = availableSuburbs.map(suburb => suburb._id);

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
      log.error(exception);
      throw exception;
    }
  },

  'stylists.favourite': function favouriteStylist(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { owner, favourite } = data;
    check(owner, String);
    check(favourite, Boolean);

    try {
      if (favourite) {
        Stylists.update({ owner }, { $addToSet: { favourites: this.userId } });
        Profiles.update({ owner: this.userId }, { $addToSet: { favouredStylists: owner } });
      } else {
        Stylists.update({ owner }, { $pull: { favourites: this.userId } });
        Profiles.update({ owner: this.userId }, { $pull: { favouredStylists: owner } });
      }
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylists.favoured': function favouredStylist() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const { favouredStylists } = Profiles.findOne(
        { owner: this.userId },
        { fields: { favouredStylists: 1 } },
      );

      if (_.isEmpty(favouredStylists)) {
        return [];
      }

      // query Stylists
      return Stylists.find(
        { owner: { $in: favouredStylists } },
        {
          fields: {
            owner: 1,
            'services.name': 1,
            name: 1,
            'address.state': 1,
            'address.suburb': 1,
            photo: 1,
            averageRating: 1,
          },
        },
      ).fetch();
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylists.portfolioPhotos': function stylistPortfolioPhotos() {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const stylist = Stylists.findOne(
        { owner: this.userId },
        {
          fields: {
            portfolioPhotos: 1,
          },
        },
      );

      if (stylist.portfolioPhotos) {
        return _.orderBy(stylist.portfolioPhotos, 'displayOrder');
      }

      return [];
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylists.portfolioPhotos.update': function updateStylistPortfolioPhotos(photos) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(photos, Array);

    try {
      // delete deselected photos from cloud
      const newPhotoUrls = photos.map(photo => photo.url);
      const { portfolioPhotos: currentPhotos } = Stylists.findOne({ owner: this.userId });

      if (currentPhotos) {
        currentPhotos.forEach((photo) => {
          if (newPhotoUrls.indexOf(photo.url) === -1) {
            deleteCloudinaryFile(photo.url);
          }
        });
      }

      // displayOrder from client may be inconsistent or not in sequence
      const portfolioPhotos = _.sortBy(photos, 'displayOrder').map((photo, index) => ({
        url: photo.url,
        displayOrder: index,
      }));

      Stylists.update(
        { owner: this.userId },
        {
          $set: {
            portfolioPhotos,
          },
        },
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylists.search': searchStylists,
});

rateLimit({
  methods: [
    'stylists.services',
    'stylists.services.update',
    'stylists.openHours',
    'stylists.openHours.update',
    'stylists.areas',
    'stylists.areas.update',
    'stylists.favourite',
    'stylists.favoured',
    'stylists.portfolioPhotos',
    'stylists.portfolioPhotos.update',
    'stylists.search',
  ],
  limit: 5,
  timeRange: 1000,
});
