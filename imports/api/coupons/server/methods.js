import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Coupons from '../coupons';
import { dateString } from '../../../modules/format-date';

Meteor.methods({
  'coupons.verify': function verifyCoupon(code) {
    check(code, String);

    try {
      const coupon = Coupons.findOne(
        {
          code: code.toUpperCase(),
          status: 'printed',
          redeemedAt: { $exists: 0 },
          redeemedBooking: { $exists: 0 },
        },
        {
          fields: {
            code: 1,
            discount: 1,
            minBookingValue: 1,
            expiry: 1,
          },
        },
      );

      if (!coupon) {
        return { error: 'invalid coupon code' };
      } else if (coupon.expiry && coupon.expiry < Date.now()) {
        return { error: `coupon expired on ${dateString(coupon.expiry)}` };
      }

      return { coupon };
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['coupons.verify'],
  limit: 5,
  timeRange: 1000,
});
