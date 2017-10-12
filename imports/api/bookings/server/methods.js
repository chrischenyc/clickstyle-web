import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Bookings from '../bookings';
import rateLimit from '../../../modules/rate-limit';

Meteor.methods({
  'bookings.insert': function bookingsInsert(booking) {
    check(booking, {
      title: String,
      body: String,
    });

    try {
      return Bookings.insert({ owner: this.userId, ...booking });
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },

  'bookings.update': function bookingsUpdate(booking) {
    check(booking, {
      _id: String,
      title: String,
      body: String,
    });

    try {
      const bookingId = booking._id;
      Bookings.update(bookingId, { $set: booking });
      return bookingId; // Return _id so we can redirect to booking after update.
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },

  'bookings.remove': function bookingsRemove(bookingId) {
    check(bookingId, String);

    try {
      return Bookings.remove(bookingId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  },
});

rateLimit({
  methods: ['bookings.insert', 'bookings.update', 'bookings.remove'],
  limit: 5,
  timeRange: 1000,
});
