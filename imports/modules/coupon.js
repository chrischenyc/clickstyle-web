import _ from 'lodash';
import log from 'winston';

import Coupons from '../api/coupons/coupons';
import { dateString } from './format-date';
import formatPrice from './format-price';

export const validateCoupon = (code) => {
  try {
    const coupon = Coupons.findOne(
      {
        code: code.toUpperCase(),
      },
      {
        fields: {
          code: 1,
          discount: 1,
          minBookingValue: 1,
          expiry: 1,
          status: 1,
        },
      },
    );

    if (!coupon) {
      return { error: 'invalid coupon code' };
    } else if (coupon.status === 'redeemed') {
      return {
        ..._.omit(coupon, 'status'),
        error: 'coupon has been redeemed',
      };
    } else if (coupon.expiry && coupon.expiry < Date.now()) {
      return {
        ..._.omit(coupon, 'status'),
        error: `coupon expired on ${dateString(coupon.expiry)}`,
      };
    }

    return {
      ..._.omit(coupon, 'status'),
    };
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
};

export const evaluateCoupon = (coupon, total) => {
  if (!_.isEmpty(coupon.error)) {
    return {
      appliedDiscount: 0,
      ...coupon,
    };
  }

  if (total < coupon.minBookingValue) {
    return {
      ...coupon,
      appliedDiscount: 0,
      error: `minimum booking value to redeem this coupon is ${formatPrice(coupon.minBookingValue)}`,
    };
  }

  return {
    ...coupon,
    appliedDiscount: Math.min(total, coupon.discount),
  };
};
