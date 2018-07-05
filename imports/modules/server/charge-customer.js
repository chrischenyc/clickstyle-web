import { Meteor } from 'meteor/meteor';
import log from 'winston';

import Payments from '../../api/payments/payments';
import { sendCustomerPaymentEmail } from './send-email';
import formatPrice from '../format-price';
import Profiles from '../../api/profiles/profiles';

const stripe = require('stripe')(Meteor.settings.StripeSecretKey);

export default async function chargeCustomer(booking, amount, stripeDescription, description) {
  try {
    let charge;
    try {
      charge = await stripe.charges.create({
        amount: amount * 100,
        currency: 'aud',
        customer: booking.stripeCustomerId,
        source: booking.stripeCardId,
        description: stripeDescription,
      });
    } catch (error) {
      // keep a failed charge anyway
      Payments.insert({
        booking: booking._id,
        amount,
        currency: 'aud',
        stripeChargeId: error.raw.charge,
        status: error.code,
        description,
      });

      throw error;
    }

    const paymentId = Payments.insert({
      booking: booking._id,
      amount: charge.amount / 100,
      currency: charge.currency,
      stripeChargeId: charge.id,
      status: charge.status,
      description,
    });

    const { timezone } = Profiles.findOne({ owner: booking.customer });

    sendCustomerPaymentEmail({
      paymentId,
      total: formatPrice(charge.amount / 100),
      description,
      firstName: booking.firstName,
      email: booking.email,
      time: booking.time,
      bookingId: booking._id,
      bookingUrl: `users/bookings/${booking._id}`,
      timezone,
    });
  } catch (error) {
    log.error(`Charge customer error: ${error}`);
  }
}
