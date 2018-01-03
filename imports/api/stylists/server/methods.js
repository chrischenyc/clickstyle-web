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
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';

Meteor.methods({
  'stylists.update.services': function updateStylistsServices(services) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(services, Array);

    try {
      Stylists.update({ owner: this.userId }, { $set: { services, published: true } });

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
              published: false,
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
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'stylists.search': function searchStylists(data) {
    check(data, Object);

    const {
      service, suburb: suburbName, postcode, date, time, offset,
    } = data;
    check(service, String);
    if (suburbName) {
      check(suburbName, String);
    }
    if (postcode) {
      check(postcode, String);
    }
    check(date, String);
    check(time, String);
    check(offset, Number);

    try {
      // final query selector, only look for published stylists
      let selector = {
        published: true,
      };

      // add query selector by service/addon name

      // a less precise search would be to break down service name into words,
      // match with names of services and addons in the order of keywords
      // sample conversion: "full face makeup" -> "/full.+face.+makeup/i"
      // const keywords = service.split(' ').filter(word => word !== 'and');
      // let regex = '';
      // for (let index = 0; index < keywords.length; index += 1) {
      //   regex += keywords[index];
      //   if (index < keywords.length - 1) {
      //     regex += '.+';
      //   }
      // }

      const serviceNameSelector = { 'services.name': RegExp(service, 'i') };
      const addonNameSelector = {
        'services.addons.name': RegExp(service, 'i'),
      };

      const keywords = service.split(' ');
      let nameSelector = {
        $or: [{ 'name.first': RegExp(service, 'i') }, { 'name.last': RegExp(service, 'i') }],
      };
      if (keywords.length > 1) {
        nameSelector = {
          $and: [
            { 'name.first': RegExp(keywords[0], 'i') },
            { 'name.last': RegExp(keywords[1], 'i') },
          ],
        };
      }

      selector = {
        ...selector,
        ...{ $or: [serviceNameSelector, addonNameSelector, nameSelector] },
      };

      // add query selector by available suburbs
      if (suburbName) {
        const suburbsSelector = { name: RegExp(suburbName, 'i') };
        if (postcode && postcode !== undefined) {
          suburbsSelector.postcode = postcode;
        }
        const suburbIds = Suburbs.find(suburbsSelector)
          .fetch()
          .map(suburb => suburb._id);

        selector = { ...selector, ...{ 'areas.availableSuburbs': { $in: suburbIds } } };
      }

      // query Stylists
      const stylists = Stylists.find(selector, {
        fields: {
          owner: 1,
          'services._id': 1,
          'services.basePrice': 1,
          'services.name': 1,
          name: 1,
          'address.state': 1,
          'address.suburb': 1,
          photo: 1,
          averageRating: 1,
        },
        limit: SearchLimit,
        skip: offset,
      }).fetch();

      return {
        stylists,
        hasMore: stylists.length >= SearchLimit,
      };
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
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
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'stylists.favoured': function favouredStylist(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);

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
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'stylists.portfolio.photos': function stylistPortfolioPhotos(data) {
    if (!Roles.userIsInRole(Meteor.userId(), [Meteor.settings.public.roles.stylist])) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);

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
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'stylists.portfolio.photos.update': function updateStylistPortfolioPhotos(photos) {
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
    'stylists.favourite',
    'stylists.favoured',
    'stylists.portfolio.photos',
    'stylists.portfolio.photos.update',
  ],
  limit: 5,
  timeRange: 1000,
});
