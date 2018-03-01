import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';

import Profiles from '../../profiles/profiles';
import Bookings from '../bookings';
import rateLimit from '../../../modules/server/rate-limit';
import {
  sendCustomerBookingRequestedEmail,
  sendStylistBookingRequestedEmail,
} from '../../../modules/server/send-email';

import { parseDateQueryString, formatDateDisplayString } from '../../../modules/format-date';

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

const servicesSummary = (services) => {
  let result = '';

  services.forEach((service, index) => {
    result += service.name;

    if (service.addons.length > 0) {
      result += ' (including ';
    }

    service.addons.forEach((addon) => {
      result += addon.name;
    });

    if (service.addons.length > 0) {
      result += ')';
    }

    if (index < services.length - 1) {
      result += ', ';
    }
  });

  return result;
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
        stripeCustomer = await stripe.customers.create({ email, description: userId });
        // save the customer ID for future use
        Profiles.update({ owner: userId }, { $set: { stripeCustomerId: stripeCustomer.id } });
      }

      const total = calculateTotal(services);

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
          time: `${formatDateDisplayString(parseDateQueryString(date))} ${time}`,
          bookingsId,
          bookingUrl: `bookings/${bookingsId}`,
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
          time: `${formatDateDisplayString(parseDateQueryString(date))} ${time}`,
          bookingsId,
          bookingUrl: `bookings/${bookingsId}`,
        });

        return bookingsId;
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
          time: `${formatDateDisplayString(parseDateQueryString(date))} ${time}`,
          bookingsId,
          bookingUrl: `bookings/${bookingsId}`,
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
          time: `${formatDateDisplayString(parseDateQueryString(date))} ${time}`,
          bookingsId,
          bookingUrl: `bookings/${bookingsId}`,
        });

        return bookingsId;
      }
      // invalid saved card, throw exception
      throw new Error('Invalid payment method, please try with a new credit/debit card.');
    } catch (exception) {
      // TODO: in case of any error, revoke user/profile and Stripe account created

      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500', exception);
    }
  },

  'bookings.find': function bookingsFind(_id) {
    check(_id, String);

    try {
      const booking = Bookings.findOne(
        { _id },
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
      // TODO: in case of any error, revoke user/profile and Stripe account created

      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: ['bookings.create'],
  limit: 5,
  timeRange: 1000,
});
