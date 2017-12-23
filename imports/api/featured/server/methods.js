import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../../stylists/stylists';
import Profiles from '../../profiles/profiles';
import Suburbs from '../../suburbs/suburbs';
import Featured from '../../featured/featured';

Meteor.methods({
  'featured.home.stylists': function searchFeaturedStylistsOnHome(data) {
    check(data, Object);

    const { suburb } = data;
    if (suburb) {
      check(suburb, String);
    }
    let suburbName = suburb;

    if (_.isNil(suburbName) && this.userId) {
      const currentUserProfile = Profiles.findOne({ owner: this.userId });

      suburbName = currentUserProfile.address && currentUserProfile.address.suburb;
    }

    try {
      let locationBased = false;

      let stylists = [];

      if (suburbName) {
        // query by available in suburb
        const suburbIds = Suburbs.find({ name: RegExp(suburbName, 'i') })
          .fetch()
          .map(s => s._id);

        stylists = Stylists.find(
          { published: true, 'areas.availableSuburbs': { $in: suburbIds } },
          {
            fields: { owner: 1, 'services.name': 1 },
          },
        ).fetch();
      }

      const homeFeaturedStylists = Featured.findOne().homeFeaturedStylists;
      if (stylists.length > 0) {
        locationBased = true;
      } else {
        // if not found nearby stylists, look for system featured stylists
        const stylistIds = homeFeaturedStylists.map(stylist => stylist.owner);

        stylists = Stylists.find(
          { published: true, owner: { $in: stylistIds } },
          {
            fields: {
              owner: 1,
              'services.name': 1,
              name: 1,
              'address.state': 1,
              'address.suburb': 1,
              photo: 1,
            },
          },
        ).fetch();
      }

      // aggregate results
      const merged = stylists.map((stylist, index) => {
        // insert display order
        let displayOrder = index;
        if (suburbName) {
          // TODO: stylists sorting
        } else {
          displayOrder = homeFeaturedStylists.filter(featuredStylist => featuredStylist.owner === stylist.owner)[0].displayOrder;
        }

        return {
          ...stylist,
          displayOrder,
        };
      });

      return {
        stylists: _.orderBy(merged, ['displayOrder']),
        locationBased,
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
  methods: ['featured.home.stylists'],
  limit: 5,
  timeRange: 1000,
});
