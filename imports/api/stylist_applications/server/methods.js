import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';
import {
  sendStylistJoinConfirmEmail,
  sendAdminStylistApplicationEmail,
} from '../../../modules/server/send-email';

Meteor.methods({
  'stylistApplications.create': function stylistsJoin(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const {
      mobile, address, services, qualificationUrl, referenceUrl, experienceYears,
    } = data;

    try {
      check(mobile, String);
      check(address, String);
      check(services, Array);
      if (qualificationUrl) {
        check(qualificationUrl, String);
      }
      check(referenceUrl, String);
      check(experienceYears, String);

      const profile = Profiles.findOne({ owner: this.userId });

      const applicationId = StylistApplications.insert({
        userId: this.userId,
        name: `${profile.name.first} ${profile.name.last}`,
        email: profile.email,
        mobile,
        address,
        services,
        qualificationUrl,
        referenceUrl,
        experienceYears,
        approved: false,
      });

      Meteor.defer(() => {
        sendStylistJoinConfirmEmail(this.userId);
        sendAdminStylistApplicationEmail(applicationId);
      });
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylistApplications.self': function stylistsApplication() {
    if (!this.userId) {
      return null;
    }

    return StylistApplications.findOne({ userId: this.userId });
  },
});

rateLimit({
  methods: ['stylistApplications.create', 'stylistApplications.self'],
  limit: 5,
  timeRange: 1000,
});
