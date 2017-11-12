import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Stylists from '../stylists';

Meteor.methods({
  'stylists.update.services': function updateStylistsServices(services) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    log.info('Meteor.methods - stylists.update.services', `userId - ${this.userId}`);

    check(services, Array);

    try {
      Stylists.update({ owner: this.userId }, { $set: services });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['stylists.update.services'],
  limit: 5,
  timeRange: 1000,
});
