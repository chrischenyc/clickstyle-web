import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import log from 'winston';
import moment from 'moment';

import Profiles from '../../profiles/profiles';
import Bookings from '../bookings';
import rateLimit from '../../../modules/server/rate-limit';
import {
  sendCustomerBookingRequestedEmail,
  sendStylistBookingRequestedEmail,
  sendCustomerBookingConfirmedEmail,
  sendCustomerBookingDeclinedEmail,
  sendCustomerBookingCancelledByStylistEmail,
  sendAdminEmailConfirmedBookingCancelledByStylist,
} from '../../../modules/server/send-email';

import { parseUrlQueryDate, dateString, parseBookingDateTime } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';
import Stylists from '../../stylists/stylists';

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

Meteor.methods({
  'bookings.create': async function bookingsCreate(cart) {
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
      const { stripeCustomerId, stripeCardId } = Profiles.findOne({
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
                stripeCardId: card.id,
                stripeCardLast4: card.last4,
                stripeCardName: creditCardNameOnCard,
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
      } else if (stripeCustomer.default_source === stripeCardId) {
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
  },

  'requested.booking.find': function requestedBookingFind(object) {
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
  },

  'customer.booking.find': function customerBookingFind(_id) {
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
          },
        },
      );

      const stylist = Profiles.findOne({ owner: booking.stylist });

      return { ...booking, stylist };
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylist.booking.find': function stylistBookingFind(_id) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const booking = Bookings.findOne(
        { _id, stylist: this.userId },
        {
          fields: {
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
          },
        },
      );

      const customer = Profiles.findOne({ owner: booking.customer });

      return { ...booking, customer };
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'customer.bookings.find': function customerBookingsFind() {
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
  },

  'stylist.bookings.find': function stylistBookingsFind() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const bookings = Bookings.find(
        { stylist: this.userId },
        {
          fields: {
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
          },
          sort: { createdAt: -1 },
        },
      );

      return bookings.map((booking) => {
        const customer = Profiles.findOne({ owner: booking.customer });

        return { ...booking, customer };
      });
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'stylist.booking.pending.confirm': function stylistConfirmPendingBooking(_id) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const booking = Bookings.findOne({ _id, stylist: this.userId });
      if (!booking) {
        throw new Meteor.Error(403, 'unauthorized');
      }

      // date validation, booked date shouldn't pass current date
      const bookingStartDateTime = parseBookingDateTime(booking.date + booking.time);
      if (bookingStartDateTime.isBefore(moment())) {
        throw new Meteor.Error('the booked date is in the past, cannot proceed');
      }

      // stylist calendar validation
      const bookingEndDateTime = moment(bookingStartDateTime).add(booking.duration, 'minutes');
      const bookingStartTimeslot = parseInt(bookingStartDateTime.format('YYMMDDHHmm'), 10);
      const bookingEndTimeslot = parseInt(bookingEndDateTime.format('YYMMDDHHmm'), 10);
      const { occupiedTimeSlots } = Stylists.findOne({ owner: this.userId });
      const overlappedTimeslots = occupiedTimeSlots.filter(timeslot =>
        (timeslot.from >= bookingStartTimeslot && timeslot.from <= bookingEndTimeslot) ||
          (timeslot.to >= bookingStartTimeslot && timeslot.to <= bookingEndTimeslot) ||
          (timeslot.from < bookingStartTimeslot && timeslot.to > bookingEndTimeslot));

      if (overlappedTimeslots.length > 0) {
        throw new Meteor.Error('there is a conflict in your calendar, cannot proceed');
      }

      // update bookings record, insert timestamp
      Bookings.update(
        { _id, stylist: this.userId },
        { $set: { status: 'confirmed', stylistConfirmedAt: Date.now() } },
      );

      // block stylist timeslot
      Stylists.update(
        { owner: this.userId },
        {
          $push: {
            occupiedTimeSlots: {
              from: bookingStartTimeslot,
              to: bookingEndTimeslot,
              state: 'booked',
              bookingId: _id,
            },
          },
        },
      );

      // notify customer
      const stylist = Stylists.findOne({ owner: this.userId });
      const {
        services, total, firstName, lastName, email, mobile, address, date, time,
      } = booking;
      sendCustomerBookingConfirmedEmail({
        stylist: `${stylist.name.first} ${stylist.name.last}`,
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
  },

  'stylist.booking.pending.decline': function stylistDeclinePendingBooking(_id) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const booking = Bookings.findOne({ _id, stylist: this.userId });
      if (!booking) {
        throw new Meteor.Error(403, 'unauthorized');
      }

      // update bookings record, insert timestamp
      Bookings.update(
        { _id, stylist: this.userId },
        { $set: { status: 'declined', stylistDeclinedAt: Date.now() } },
      );

      // notify customer
      const stylist = Stylists.findOne({ owner: this.userId });
      const {
        services, total, firstName, lastName, email, mobile, address, date, time,
      } = booking;
      sendCustomerBookingDeclinedEmail({
        stylist: `${stylist.name.first} ${stylist.name.last}`,
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
  },

  'stylist.booking.confirmed.cancel': function stylistCancelConfirmedBooking(_id) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const booking = Bookings.findOne({ _id, stylist: this.userId });
      if (!booking) {
        throw new Meteor.Error(403, 'unauthorized');
      }

      // update bookings record, insert timestamp
      Bookings.update(
        { _id, stylist: this.userId },
        { $set: { status: 'cancelled', stylistCancelledAt: Date.now() } },
      );

      // notify customer
      const stylist = Stylists.findOne({ owner: this.userId });
      const {
        services, total, firstName, lastName, email, mobile, address, date, time,
      } = booking;

      sendCustomerBookingCancelledByStylistEmail({
        stylist: `${stylist.name.first} ${stylist.name.last}`,
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

      // notify admin
      sendAdminEmailConfirmedBookingCancelledByStylist(_id);
    } catch (exception) {
      log.error(exception);

      throw exception;
    }
  },
});

rateLimit({
  methods: [
    'bookings.create',
    'requested.booking.find',
    'customer.booking.find',
    'stylist.booking.find',
    'customer.bookings.find',
    'stylist.bookings.find',
    'stylist.booking.pending.confirm',
    'stylist.booking.confirmed.cancel',
  ],
  limit: 5,
  timeRange: 1000,
});
