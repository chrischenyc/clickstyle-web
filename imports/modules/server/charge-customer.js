import { Meteor } from 'meteor/meteor';
import log from 'winston';

import Payments from '../../api/payments/payments';
import { sendCustomerPaymentEmail } from './send-email';
import formatPrice from '../format-price';

const stripe = require('stripe')(Meteor.settings.StripeSecretKey);

export default async function chargeCustomer(booking, amount, stripeDescription, description) {
  try {
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'aud',
      customer: booking.stripeCustomerId,
      source: booking.stripeCardId,
      description: stripeDescription,
    });

    const paymentId = Payments.insert({
      booking: booking._id,
      amount: charge.amount / 100,
      currency: charge.currency,
      stripeChargeId: charge.id,
      status: charge.status,
      description,
    });

    sendCustomerPaymentEmail({
      paymentId,
      total: formatPrice(charge.amount),
      description,
      firstName: booking.firstName,
      email: booking.email,
      bookingsId: booking._id,
      bookingUrl: `users/bookings/${booking._id}`,
    });
  } catch (error) {
    log.error(`Charge customer error: ${error}`);
  }
}
