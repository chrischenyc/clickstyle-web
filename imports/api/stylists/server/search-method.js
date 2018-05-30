import { check } from 'meteor/check';
import log from 'winston';
import _ from 'lodash';

import Stylists from '../stylists';
import Suburbs from '../../suburbs/suburbs';
import Services from '../../services/services';
import { SearchLimit } from '../../../modules/server/constants';
import isTimeQueryValid from '../../../modules/validate-time-query';
import { parseUrlQueryDate } from '../../../modules/format-date';
import scaledImageURL from '../../../modules/scaled-image-url';

export default function searchStylists(data) {
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
    // FIXME: need timezone
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
}
