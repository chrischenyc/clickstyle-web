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
import Services from '../../services/services';
import { SearchLimit } from '../../../modules/server/constants';
import coordinatesDistance from '../../../modules/server/coordinates-distance';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';
import isTimeQueryValid from '../../../modules/validate-time-query';
import { parseUrlQueryDate } from '../../../modules/format-date';
import updateStylistOccupiedTimeSlots from '../../../modules/server/update-stylist-occupied-timeslots';
import scaledImageURL from '../../../modules/scaled-image-url';

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

  'stylists.update.openHours': function updateStylistsOpenHours(openHours) {
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

  'stylists.update.areas': function updateStylistsAreas(areas) {
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

  'stylists.portfolio.photos': function stylistPortfolioPhotos() {
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
      log.error(exception);
      throw exception;
    }
  },

  'stylists.search': function searchStylists(data) {
    check(data, Object);

    const {
      service, suburb: suburbName, postcode, date, time, duration, offset,
    } = data;
    check(service, String);
    if (suburbName) {
      check(suburbName, String);
    }
    if (postcode) {
      check(postcode, String);
    }
    if (date) {
      check(date, String);
    }
    if (time) {
      check(time, String);
    }
    if (duration) {
      check(duration, Number);
    }
    if (offset) {
      check(offset, Number);
    }

    try {
      // ----------- BASE SELECTOR -----------------
      let selector = {
        published: true,
      };

      // ----------- SELECTOR FOR SERVICE/ADDON NAME, STYLIST NAME -----------------
      // TODO: replace name search selectors with $text $search
      const serviceNameSelector = { 'services.name': RegExp(service, 'i') };
      const addonNameSelector = {
        'services.addons.name': RegExp(service, 'i'),
      };

      const keywords = service.split(' ');
      let stylistNameSelector = {
        $or: [{ 'name.first': RegExp(service, 'i') }, { 'name.last': RegExp(service, 'i') }],
      };
      if (keywords.length > 1) {
        stylistNameSelector = {
          $and: [
            { 'name.first': RegExp(keywords[0], 'i') },
            { 'name.last': RegExp(keywords[1], 'i') },
          ],
        };
      }

      const nameSelector = { $or: [serviceNameSelector, addonNameSelector, stylistNameSelector] };

      selector = {
        ...selector,
        ...nameSelector,
      };

      // ----------- SELECTOR FOR SUBURB -----------------
      if (suburbName) {
        const suburbsSelector = { name: RegExp(suburbName, 'i') };
        if (postcode && postcode !== undefined) {
          suburbsSelector.postcode = postcode;
        }
        const suburbIds = Suburbs.find(suburbsSelector)
          .fetch()
          .map(suburb => suburb._id);

        const suburbSelector = { 'areas.availableSuburbs': { $in: suburbIds } };

        selector = { ...selector, ...suburbSelector };
      }

      // ----------- SELECTOR FOR OPEN HOURS -----------------
      const isDateValid = parseUrlQueryDate(date).isValid();
      const isTimeValid = isTimeQueryValid(time);

      if (isDateValid && isTimeValid) {
        // both date and time are selected
        const fromTimeString = time.replace(':', '');

        // convert to strings
        const fromHour = parseInt(time.split(':')[0], 10);
        const fromMinute = parseInt(time.split(':')[1], 10);

        let toHour = fromHour;
        let toMinute = fromMinute + duration;
        if (toMinute >= 60) {
          toHour += 1;
          toMinute -= 60;
        }
        const toTimeString =
          toHour.toString().padStart(2, '0') + toMinute.toString().padStart(2, '0');

        const fromDateTime = parseInt(date + fromTimeString, 10);
        const toDateTime = parseInt(date + toTimeString, 10);

        const dateTimeSelector = {
          $nor: [
            {
              occupiedTimeSlots: {
                $elemMatch: { from: { $lte: fromDateTime }, to: { $gte: toDateTime } },
              },
            },
            {
              occupiedTimeSlots: {
                $elemMatch: { from: { $gte: fromDateTime, $lt: toDateTime } },
              },
            },
            {
              occupiedTimeSlots: {
                $elemMatch: { to: { $gt: fromDateTime, $lte: toDateTime } },
              },
            },
          ],
        };

        selector = {
          ...selector,
          ...dateTimeSelector,
        };
      } else if (isDateValid) {
        // only date is selected
        const fromDateTime = parseInt(`${date}0000`, 10);
        const toDateTime = parseInt(`${date}2359`, 10);

        const dateTimeSelector = {
          $nor: [
            {
              occupiedTimeSlots: {
                $elemMatch: { from: fromDateTime, to: toDateTime },
              },
            },
          ],
        };

        selector = {
          ...selector,
          ...dateTimeSelector,
        };
      } else if (isTimeValid) {
        // TODO: what if only time is selected
      }

      // ----------- RUN QUERY -----------------
      let stylists = Stylists.find(selector, {
        fields: {
          owner: 1,
          'services._id': 1,
          'services.basePrice': 1,
          'services.name': 1,
          name: 1,
          'address.state': 1,
          'address.suburb': 1,
          photo: 1,
          reviewsCount: 1,
          averageRating: 1,
          portfolioPhotos: 1,
        },
        limit: SearchLimit,
        skip: offset,
      }).fetch();

      // ----------- ATTACH EXTRA FIELDS -----------
      // banner photos
      stylists = stylists.map((stylist) => {
        if (stylist.portfolioPhotos && stylist.portfolioPhotos.length > 0) {
          return {
            ..._.omit(stylist, 'portfolioPhotos'),
            bannerPhotos: stylist.portfolioPhotos.map(portfolioPhoto => portfolioPhoto.url),
          };
        }

        const services = Services.find().fetch();
        return {
          ..._.omit(stylist, 'portfolioPhotos'),
          bannerPhotos: stylist.services.map(stylistService => services.filter(s => s._id === stylistService._id)[0].photo),
        };
      });

      // use scaled photo urls
      stylists = stylists.map(stylist => ({
        ...stylist,
        bannerPhotos: stylist.bannerPhotos
          .filter(url => !_.isNil(url))
          .map(url => scaledImageURL(url, 'small')),
      }));

      return {
        stylists,
        hasMore: stylists.length >= SearchLimit,
      };
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: [
    'stylists.update.services',
    'stylists.update.openHours',
    'stylists.update.areas',
    'stylists.favourite',
    'stylists.favoured',
    'stylists.portfolio.photos',
    'stylists.portfolio.photos.update',
    'stylists.search',
  ],
  limit: 5,
  timeRange: 1000,
});
