import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Bookings from '../bookings';
import rateLimit from '../../../modules/server/rate-limit';

Meteor.methods({
  'bookings.create': function bookingsInsert(cart) {
    check(cart, {
      stylist: Object,
      services: Array,
      total: Number,
      count: Number,
      firstName: String,
      lastName: String,
      email: String,
      mobile: String,
      address: String,
      date: String,
      time: String,
      creditCardNameOnCard: String,
      creditCardSaveCard: Boolean,
      register: Boolean,
      stripePayload: Object,
    });

    try {
      const {
        stylist,
        services,
        total,
        count,
        firstName,
        lastName,
        email,
        mobile,
        address,
        date,
        time,
        creditCardNameOnCard,
        creditCardSaveCard,
        register,
        stripePayload,
      } = cart;

      // process Stripe token
      console.log(stripePayload);

      // if success create Bookings record

      // if Stripe fail, return errors

      // link Stripe card token with the Bookings record

      // if guest check out, try to match the email with any user

      // if no user found, create one
      const userId = this.userId;

      // if guest user selects to sign up, send out welcome and reset password

      // if user selects to save credit card, save credit card token and its partial info

      // send customer email notification

      // send stylist email notification
    } catch (exception) {
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
