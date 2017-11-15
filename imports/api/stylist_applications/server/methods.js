import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';

Meteor.methods({
  'stylists.join': function stylistsJoin(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const {
      mobile, address, services, qualificationUrl, referenceUrl,
    } = data;

    try {
      check(mobile, String);
      check(address, String);
      check(services, Array);
      if (qualificationUrl) {
        check(qualificationUrl, String);
      }
      check(referenceUrl, String);

      const profile = Profiles.findOne({ owner: this.userId });

      StylistApplications.insert({
        userId: this.userId,
        name: `${profile.name.first} ${profile.name.last}`,
        email: profile.email,
        mobile,
        address,
        services,
        qualificationUrl,
        referenceUrl,
        approved: false,
      });

      log.info('Meteor.methods - stylists.join', `userId - ${this.userId}`);
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['stylists.join'],
  limit: 5,
  timeRange: 1000,
});
