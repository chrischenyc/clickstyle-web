import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import log from 'winston';
import moment from 'moment';

import Profiles from '../../profiles/profiles';
import Bookings from '../bookings';
import Payments from '../../payments/payments';

import {
  sendCustomerBookingRequestedEmail,
  sendCustomerPaymentEmail,
  sendStylistBookingRequestedEmail,
  sendStylistBookingCancelledByCustomerEmail,
} from '../../../modules/server/send-email';

import { parseUrlQueryDate, dateString, parseBookingDateTime } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';
import Stylists from '../../stylists/stylists';
import formatPrice from '../../../modules/format-price';

const stripe = require('stripe')(Meteor.settings.StripeSecretKey);

// re-calculate total on server side
const calculateTotal = (services) => {
  let total = 0;

  services.forEach((service) => {
    total += service.basePrice;

    service.addons.forEach((addon) => {
      total += addon.price;
    });
  });

  return total;
};

const calculateTotalDuration = (services) => {
  let total = 0;

  services.forEach((service) => {
    total += service.baseDuration;

    service.addons.forEach((addon) => {
      total += addon.duration;
    });
  });

  return total;
};

const customerCancellationFee = (booking) => {
  if (booking.status !== 'confirmed') {
    return 0;
  }

  const now = moment();
  const prior24Hours = parseBookingDateTime(booking.date + booking.time).subtract(1, 'days');
  const prior4Hours = parseBookingDateTime(booking.date + booking.time).subtract(4, 'hours');
  if (now.isBefore(prior24Hours)) {
    return 0;
  } else if (now.isBefore(prior4Hours)) {
    return booking.total * 0.5;
  }
  return booking.total;
};

const customerCancellationFeeReason = (booking) => {
  if (booking.status !== 'confirmed') {
    return '';
  }

  const now = moment();
  const prior24Hours = parseBookingDateTime(booking.date + booking.time).subtract(1, 'days');
  const prior4Hours = parseBookingDateTime(booking.date + booking.time).subtract(4, 'hours');

  if (now.isBefore(prior24Hours)) {
    return "as it's 24 hours before booked time";
  } else if (now.isBefore(prior4Hours)) {
    return "as it's less than 24 hours before booked time";
  }
  return "as it's less than 4 hours before booked time";
};

export async function customerCreateBooking(cart) {
  check(cart, {
    stylist: Object,
    services: Array,
    total: Number,
    firstName: String,
    lastName: String,
    email: String,
    mobile: String,
    address: String,
    date: String,
    time: String,
    creditCardNameOnCard: String,
    creditCardSaveCard: Boolean,
    stripePayload: Object,
  });

  try {
    const {
      firstName,
      lastName,
      email,
      stylist,
      services,
      mobile,
      address,
      date,
      time,
      creditCardNameOnCard,
      creditCardSaveCard,
      stripePayload,
    } = cart;

    let { userId } = this;

    // pre-processing for guest user checkout
    if (!userId) {
      // verify email is not taken
      if (Profiles.findOne({ email })) {
        throw new Meteor.Error('email is taken. please log in if you are already a user');
      }

      // create a new user account without password
      userId = Accounts.createUser({
        email,
        profile: { name: { first: firstName, last: lastName } },
      });

      Accounts.sendEnrollmentEmail(userId);
    }

    const { email: stylistEmail } = Profiles.findOne({ owner: stylist.owner });

    // find existing Stripe customer record, or create a new one
    const { stripeCustomerId, stripeDefaultCardId } = Profiles.findOne({
      owner: userId,
    });

    let stripeCustomer = null;
    if (stripeCustomerId) {
      stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
    } else {
      stripeCustomer = await stripe.customers.create({
        email,
        description: `${firstName} ${lastName} (${userId})`,
      });
      // save the customer ID for future use
      Profiles.update({ owner: userId }, { $set: { stripeCustomerId: stripeCustomer.id } });
    }

    const total = calculateTotal(services);
    const duration = calculateTotalDuration(services);

    if (stripePayload) {
      // ---------- pre-processing new card ----------

      const card = await stripe.customers.createSource(stripeCustomer.id, {
        source: stripePayload.token.id,
      });

      // set saved card as customer's default_source
      stripe.customers.update(stripeCustomer.id, {
        default_source: card.id,
      });

      // add additional info to card
      stripe.customers.updateCard(stripeCustomer.id, card.id, {
        name: creditCardNameOnCard,
      });

      // keep local record of saved stripe card
      if (creditCardSaveCard) {
        Profiles.update(
          { owner: userId },
          {
            $set: {
              stripeDefaultCardId: card.id,
              stripeDefaultCardLast4: card.last4,
              stripeDefaultCardName: creditCardNameOnCard,
            },
          },
        );
      }

      // ---------- create Bookings record ----------
      const bookingsId = Bookings.insert({
        stylist: stylist.owner,
        services,
        total,
        customer: userId,
        firstName,
        lastName,
        email,
        mobile,
        address,
        date,
        time,
        stripeCustomerId: stripeCustomer.id,
        stripeCardId: card.id,
        status: 'pending',
        duration,
      });

      sendCustomerBookingRequestedEmail({
        stylist: `${stylist.name.first} ${stylist.name.last}`,
        services: servicesSummary(services),
        total,
        firstName,
        lastName,
        email,
        mobile,
        address,
        time: `${dateString(parseUrlQueryDate(date))} ${time}`,
        bookingsId,
        bookingUrl: `users/bookings/${bookingsId}`,
      });

      sendStylistBookingRequestedEmail({
        stylistEmail,
        stylistFirstName: stylist.name.first,
        services: servicesSummary(services),
        total,
        firstName,
        lastName,
        email,
        mobile,
        address,
        time: `${dateString(parseUrlQueryDate(date))} ${time}`,
        bookingsId,
        bookingUrl: `users/stylist/bookings/${bookingsId}`,
      });

      if (this.userId) {
        return { bookingsId };
      }

      return { bookingsId, userId };
    } else if (stripeCustomer.default_source === stripeDefaultCardId) {
      // user's existing card record is valid, create Bookings record directly
      const bookingsId = Bookings.insert({
        stylist: stylist.owner,
        services,
        total,
        customer: userId,
        firstName,
        lastName,
        email,
        mobile,
        address,
        date,
        time,
        stripeCustomerId: stripeCustomer.id,
        stripeCardId: stripeDefaultCardId,
        status: 'pending',
        duration,
      });

      sendCustomerBookingRequestedEmail({
        stylist: `${stylist.name.first} ${stylist.name.last}`,
        services: servicesSummary(services),
        total,
        firstName,
        lastName,
        email,
        mobile,
        address,
        time: `${dateString(parseUrlQueryDate(date))} ${time}`,
        bookingsId,
        bookingUrl: `users/bookings/${bookingsId}`,
      });

      sendStylistBookingRequestedEmail({
        stylistEmail,
        stylistFirstName: stylist.name.first,
        services: servicesSummary(services),
        total,
        firstName,
        lastName,
        email,
        mobile,
        address,
        time: `${dateString(parseUrlQueryDate(date))} ${time}`,
        bookingsId,
        bookingUrl: `users/stylist/bookings/${bookingsId}`,
      });

      if (this.userId) {
        return { bookingsId };
      }

      return { bookingsId, userId };
    }
    // invalid saved card, throw exception
    throw new Error('Invalid payment method, please try with a new credit/debit card.');
  } catch (exception) {
    // TODO: in case of any error, revoke user/profile and Stripe account created

    log.error(exception);
    throw exception;
  }
}

export async function customerCancelBooking(_id) {
  check(_id, String);

  if (!this.userId) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  try {
    const booking = Bookings.findOne({ _id, customer: this.userId });
    if (!booking) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    // update bookings record, insert timestamp
    Bookings.update(
      { _id, customer: this.userId },
      { $set: { status: 'cancelled', customerCancelledAt: Date.now() } },
    );

    // unblock occupied timeslots
    Stylists.update(
      { owner: booking.stylist },
      { $pull: { occupiedTimeSlots: { bookingId: _id } } },
    );

    // charge customer if needed
    const cancellationFee = customerCancellationFee(booking);
    if (cancellationFee > 0) {
      try {
        const charge = await stripe.charges.create({
          amount: cancellationFee * 100,
          currency: 'aud',
          customer: booking.stripeCustomerId,
          source: booking.stripeCardId,
          description: `booking cancellation: ${booking._id}`,
        });

        const description = `Booking cancellation fee ${customerCancellationFeeReason(booking)}`;

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
          total: formatPrice(cancellationFee),
          description,
          firstName: booking.firstName,
          email: booking.email,
          bookingsId: booking._id,
          bookingUrl: `users/bookings/${booking._id}`,
        });
      } catch (error) {
        log.error(`bookings.customer.cancel error: ${error}`);
      }
    }

    // notify stylist
    const stylist = Profiles.findOne({ owner: booking.stylist });
    const {
      services, total, firstName, lastName, email, mobile, address, date, time,
    } = booking;

    sendStylistBookingCancelledByCustomerEmail({
      stylistFirstName: stylist.name.first,
      stylistEmail: stylist.email,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: `${dateString(parseUrlQueryDate(date))} ${time}`,
      bookingsId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export function customerFindBooking(_id) {
  check(_id, String);

  if (!this.userId) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  try {
    const booking = Bookings.findOne(
      { _id, customer: this.userId },
      {
        fields: {
          stylist: 1,
          services: 1,
          total: 1,
          customer: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          mobile: 1,
          address: 1,
          date: 1,
          time: 1,
          status: 1,
          duration: 1,
          createdAt: 1,
          stylistConfirmedAt: 1,
          stylistDeclinedAt: 1,
          stylistCancelledAt: 1,
          customerCancelledAt: 1,
          systemCancelledAt: 1,
          stylistCompletedAt: 1,
        },
      },
    );

    const stylist = Profiles.findOne({ owner: booking.stylist });

    return {
      ...booking,
      stylist,
      cancellationFee: customerCancellationFee(booking),
      cancellationFeeReason: customerCancellationFeeReason(booking),
    };
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}

export function guestFindBooking(object) {
  check(object, Object);

  const { _id, userId } = object;
  check(_id, String);

  if (userId) {
    check(userId, String);
  }

  if ((!this.userId && !userId) || (this.userId && userId && this.userId !== userId)) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  let theUserId = this.userId;
  if (!theUserId) {
    theUserId = userId;
  }

  try {
    const booking = Bookings.findOne(
      { _id, customer: theUserId },
      {
        fields: {
          stylist: 1,
          services: 1,
          total: 1,
          customer: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          mobile: 1,
          address: 1,
          date: 1,
          time: 1,
        },
      },
    );

    return booking;
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}

export function customerListBookings() {
  if (!this.userId) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  try {
    const bookings = Bookings.find(
      { customer: this.userId },
      {
        fields: {
          stylist: 1,
          services: 1,
          total: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          address: 1,
          date: 1,
          time: 1,
          status: 1,
        },
        sort: { createdAt: -1 },
      },
    ).fetch();

    return bookings.map((booking) => {
      const stylist = Profiles.findOne({ owner: booking.stylist });
      return { ...booking, stylist };
    });
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
