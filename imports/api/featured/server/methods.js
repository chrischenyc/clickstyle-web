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

    const { suburb: suburbName } = data;
    if (suburbName) {
      check(suburbName, String);
    }

    try {
      // final query selector, only look for published stylists
      let selector = {
        published: true,
      };

      // add query selector by available suburbs
      const homeFeaturedStylists = Featured.findOne().homeFeaturedStylists;

      if (suburbName) {
        const suburbsSelector = { name: RegExp(suburbName, 'i') };
        const suburbIds = Suburbs.find(suburbsSelector)
          .fetch()
          .map(suburb => suburb._id);

        selector = { ...selector, ...{ 'areas.availableSuburbs': { $in: suburbIds } } };
      } else {
        // query home featured
        const stylistIds = homeFeaturedStylists.map(stylist => stylist.owner);

        selector = { ...selector, owner: { $in: stylistIds } };
      }

      // query Stylists
      const stylists = Stylists.find(selector, {
        fields: { owner: 1, 'services.name': 1 },
      }).fetch();

      // query Profiles
      const userIds = stylists.map(stylist => stylist.owner);
      const profiles = Profiles.find(
        { owner: { $in: userIds } },
        {
          fields: {
            owner: 1,
            name: 1,
            'address.state': 1,
            'address.suburb': 1,
            photo: 1,
          },
        },
      ).fetch();

      const unsorted = stylists.map((stylist, index) => {
        const filteredProfiles = profiles.filter(profile => profile.owner === stylist.owner);

        // insert display order
        let displayOrder = index;
        if (suburbName) {
          // TODO: display order when search in suburb
          displayOrder = index;
        } else {
          displayOrder = homeFeaturedStylists.filter(featured => featured.owner === stylist.owner)[0].displayOrder;
        }

        return {
          ...stylist,
          displayOrder,
          profile: filteredProfiles.length > 0 && filteredProfiles[0],
        };
      });

      return _.orderBy(unsorted, ['displayOrder']);
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
