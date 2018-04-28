import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import log from 'winston';
import moment from 'moment';

import Profiles from '../../profiles/profiles';
import Bookings from '../bookings';
import BookingActivities from '../../booking_activities/booking_activities';
import Stylists from '../../stylists/stylists';
import Payments from '../../payments/payments';
import Reviews from '../../reviews/reviews';
import {
  sendCustomerBookingRequestedEmail,
  sendStylistBookingRequestedEmail,
  sendStylistBookingCancelledByCustomerEmail,
} from '../../../modules/server/send-email';
import { dateTimeString } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';
import chargeCustomer from '../../../modules/server/charge-customer';
import formatOccupiedTimeSlot from '../../../modules/server/format-occupied-time-slot';
import { calculateTotal, calculateTotalDuration } from '../../../modules/cart-calculator';

const stripe = require('stripe')(Meteor.settings.StripeSecretKey);

/**
 * return {fee: Number, description: String}
 * @param {Bookings object} booking
 */
const customerCancellationFee = (booking) => {
  if (booking.status !== 'confirmed') {
    return { fee: 0, description: 'free cancellation for unconfirmed bookings' };
  }

  const now = moment();
  const prior12Hours = moment(booking.time).subtract(12, 'hours');
  const prior4Hours = moment(booking.time).subtract(4, 'hours');

  if (now.isBefore(prior12Hours)) {
    return { fee: 0, description: 'free cancellation 12 hours prior booking time' };
  } else if (now.isBefore(prior4Hours)) {
    return {
      fee: booking.total * 0.5,
      description:
        'fee is 50% of booking value if cancelled in less than 12 hours prior booking time',
    };
  }
  return {
    fee: booking.total,
    description:
      'fee is 100% of booking value if cancelled in less than 4 hours prior booking time',
  };
};

function createBooking(cart, userId, stripeCustomerId, stripeCardId) {
  const {
    firstName, lastName, email, stylist, services, mobile, address, date, time, note,
  } = cart;

  const { email: stylistEmail } = Profiles.findOne({ owner: stylist.owner });
  const total = calculateTotal(services);
  const duration = calculateTotalDuration(services);
  const bookingTime = moment(date + time, 'YYMMDDHH:mm');

  // if bookingTime is earlier than 2 hours from now, throw Error
  if (bookingTime.isBefore(moment().add(2, 'hours'))) {
    throw new Meteor.Error('Booking time should be at least 2 hours from now.');
  }

  // stylist calendar availability validation
  const bookingEndDateTime = bookingTime.clone().add(duration, 'minutes');
  const bookingStartTimeslot = parseInt(bookingTime.format('YYMMDDHHmm'), 10);
  const bookingEndTimeslot = parseInt(bookingEndDateTime.format('YYMMDDHHmm'), 10);
  const { occupiedTimeSlots } = Stylists.findOne({ owner: stylist.owner });
  const conflictedSlots = occupiedTimeSlots.filter(occupiedSlot =>
    (occupiedSlot.from >= bookingStartTimeslot && occupiedSlot.from < bookingEndTimeslot) ||
      (occupiedSlot.to > bookingStartTimeslot && occupiedSlot.to <= bookingEndTimeslot) ||
      (occupiedSlot.from <= bookingStartTimeslot && occupiedSlot.to >= bookingEndTimeslot));

  if (conflictedSlots.length > 0) {
    let message = "cannot make this booking due to time conflicts on stylist's calendar: ";
    conflictedSlots.forEach((timeslot, index) => {
      message += `• ${formatOccupiedTimeSlot(timeslot)}`;
      if (index < conflictedSlots.length - 1) {
        message += ' ';
      }
    });

    throw new Meteor.Error(message);
  }

  // create Bookings record
  const bookingId = Bookings.insert({
    stylist: stylist.owner,
    services,
    total,
    customer: userId,
    firstName,
    lastName,
    email,
    mobile,
    address,
    time: bookingTime.toDate(),
    stripeCustomerId,
    stripeCardId,
    status: 'pending',
    duration,
    note,
  });

  // create BookingActivities record
  BookingActivities.insert({
    booking: bookingId,
    stylist: stylist.owner,
    customer: userId,
    user: userId,
    action: 'requested',
  });

  // create Notification to remind stylist
  Meteor.call('notifications.create', {
    recipient: stylist.owner,
    content: `${firstName} requested a booking for you, please response`,
    type: 'success',
    dismissible: true,
    dismissed: false,
    link: `/users/stylist/bookings/${bookingId}`,
  });

  // inform customer
  sendCustomerBookingRequestedEmail({
    stylist: `${stylist.name.first} ${stylist.name.last}`,
    services: servicesSummary(services),
    total,
    firstName,
    lastName,
    email,
    mobile,
    address,
    note,
    time: dateTimeString(bookingTime),
    bookingId,
    bookingUrl: `users/bookings/${bookingId}`,
  });

  // inform stylist
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
    note,
    time: dateTimeString(bookingTime),
    bookingId,
    bookingUrl: `users/stylist/bookings/${bookingId}`,
  });

  return bookingId;
}

export async function customerCreateBooking(cart) {
  check(cart, Object);

  try {
    const {
      firstName,
      lastName,
      email,
      creditCardNameOnCard,
      creditCardSaveCard,
      stripePayload,
      useSavedCard,
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

    if (stripePayload) {
      // ========== check-out with a new card ===========

      // save new card on Stripe
      const card = await stripe.customers.createSource(stripeCustomer.id, {
        source: stripePayload.token.id,
      });

      // set saved card as customer's default_source on Stripe
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

      const bookingId = createBooking(cart, userId, stripeCustomerId, card.id);

      // method response depends on user login status
      if (this.userId) {
        return { bookingId };
      }
      return { bookingId, userId };
    } else if (useSavedCard && stripeCustomer.default_source === stripeDefaultCardId) {
      // ========== check-out with a saved card ===========
      const bookingId = createBooking(cart, userId, stripeCustomerId, stripeDefaultCardId);

      return { bookingId };
    }

    // invalid saved card, throw exception
    throw new Meteor.Error('Invalid payment method, please try with a new credit/debit card.');
  } catch (exception) {
    throw new Meteor.Error(exception.statusCode, exception.message);
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

    // create BookingActivities record
    BookingActivities.insert({
      booking: _id,
      stylist: booking.stylist,
      customer: booking.customer,
      user: this.userId,
      action: 'cancelled',
    });

    if (booking.status === 'confirmed') {
      // charge customer if needed
      const { fee, description } = customerCancellationFee(booking);
      if (fee > 0) {
        chargeCustomer(
          booking,
          fee,
          `booking cancelled: ${booking._id}`,
          `Booking cancellation ${description}`,
        );
      }

      // unblock occupied timeslots
      Stylists.update(
        { owner: booking.stylist },
        { $pull: { occupiedTimeSlots: { bookingId: _id } } },
      );

      // notify stylist
      const stylist = Profiles.findOne({ owner: booking.stylist });
      const {
        services, total, firstName, lastName, email, mobile, address, time,
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
        time: dateTimeString(time),
        bookingId: _id,
        bookingUrl: `users/stylist/bookings/${_id}`,
      });

      Meteor.call('notifications.create', {
        recipient: booking.stylist,
        content: `${booking.firstName} cancelled a confirmed booking with you`,
        type: 'error',
        dismissible: true,
        dismissed: false,
        link: `/users/stylist/bookings/${_id}`,
      });
    }
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
          firstName: 1,
          lastName: 1,
          address: 1,
          time: 1,
          note: 1,
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

    const stylist = Profiles.findOne(
      { owner: booking.stylist },
      { fields: { owner: 1, name: 1, photo: 1 } },
    );
    const payments = Payments.find(
      { booking: booking._id },
      {
        fields: {
          amount: 1,
          createdAt: 1,
          description: 1,
          status: 1,
        },
      },
    ).fetch();

    const review = Reviews.findOne(
      { booking: booking._id },
      { fields: { createdAt: 1, rating: 1, review: 1 } },
    );

    const { fee, description } = customerCancellationFee(booking);

    return {
      ...booking,
      stylist,
      payments,
      review,
      cancellationFee: fee,
      cancellationFeeReason: description,
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

export function customerListBookings(bookingStatus) {
  check(bookingStatus, Match.Maybe(String));

  if (!this.userId) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  let selector = { customer: this.userId };
  if (bookingStatus) {
    selector = { ...selector, status: bookingStatus };
  }

  try {
    let bookings = Bookings.find(selector, {
      fields: {
        stylist: 1,
        services: 1,
        total: 1,
        time: 1,
        status: 1,
      },
      sort: { createdAt: -1 },
    }).fetch();

    // group by status
    bookings = [
      ...bookings.filter(booking => booking.status === 'pending'),
      ...bookings.filter(booking => booking.status === 'confirmed'),
      ...bookings.filter(booking => booking.status !== 'pending' && booking.status !== 'confirmed'),
    ];

    return bookings.map((booking) => {
      const stylist = Profiles.findOne(
        { owner: booking.stylist },
        { fields: { name: 1, photo: 1 } },
      );
      const review = Reviews.findOne({ booking: booking._id }, { fields: { rating: 1 } });
      return { ...booking, stylist, review };
    });
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
