import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import rateLimit from '../../../modules/server/rate-limit';
import { validateCoupon } from '../../../modules/coupon';

Meteor.methods({
  'coupons.verify': function verifyCoupon(code) {
    check(code, String);

    return validateCoupon(code);
  },
});

rateLimit({
  methods: ['coupons.verify'],
  limit: 5,
  timeRange: 1000,
});
