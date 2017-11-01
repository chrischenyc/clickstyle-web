import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';

Meteor.methods({
  'stylists.join': function stylistsJoin(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    const {
      mobile, address, services, qualification, url,
    } = data;

    try {
      check(data, Object);
      check(mobile, String);
      check(address, String);
      check(services, Array);
      if (qualification) {
        check(qualification, String);
      }
      check(url, String);

      StylistApplications.insert({
        userId: this.userId,
        mobile,
        address,
        services,
        qualification,
        url,
        approval: {
          approved: false,
        },
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
  methods: ['stylists.join'],
  limit: 5,
  timeRange: 1000,
});
