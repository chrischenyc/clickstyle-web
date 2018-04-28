import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import moment from 'moment';
import _ from 'lodash';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import { dateTimeShortString } from '../../../modules/format-date';
import Bookings from '../bookings';
import Profiles from '../../profiles/profiles';

import {
  customerCreateBooking,
  customerCancelBooking,
  customerFindBooking,
  customerListBookings,
  guestFindBooking,
} from './customer-methods';
import {
  stylistConfirmPendingBooking,
  stylistDeclinePendingBooking,
  stylistCancelConfirmedBooking,
  stylistCompleteConfirmedBooking,
  stylistFindBooking,
  stylistListBookings,
} from './stylist-methods';

function bookingSummary(booking, userId) {
  if (booking.customer === userId) {
    const { name: stylistName } = Profiles.findOne({ owner: booking.stylist });

    return `You have booked ${stylistName.first} on ${dateTimeShortString(booking.time)}`;
  }

  return `${booking.firstName} has booked you on ${dateTimeShortString(booking.time)}`;
}

function bookingLink(booking, userId) {
  if (booking.customer === userId) {
    return `/users/bookings/${booking._id}`;
  }

  return `/users/stylist/bookings/${booking._id}`;
}

Meteor.methods({
  'bookings.customer.create': customerCreateBooking,
  'bookings.customer.cancel': customerCancelBooking,
  'bookings.guest.find': guestFindBooking,
  'bookings.customer.find': customerFindBooking,
  'bookings.customer.list': customerListBookings,
  'bookings.stylist.find': stylistFindBooking,
  'bookings.stylist.list': stylistListBookings,
  'bookings.stylist.confirm.pending': stylistConfirmPendingBooking,
  'bookings.stylist.decline.pending': stylistDeclinePendingBooking,
  'bookings.stylist.cancel.confirmed': stylistCancelConfirmedBooking,
  'bookings.stylist.complete.confirmed': stylistCompleteConfirmedBooking,
  'bookings.upcoming': function usersUpcomingBookings() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    const bookings = Bookings.find(
      {
        status: 'confirmed',
        time: {
          $gte: new Date(),
          $lte: moment()
            .add(7, 'days')
            .toDate(),
        },
        $or: [{ customer: this.userId }, { stylist: this.userId }],
      },
      {
        fields: {
          time: 1,
          customer: 1,
          stylist: 1,
          firstName: 1,
        },
        limit: 10,
        sort: { time: 1 },
      },
    )
      .fetch()
      .map(booking => ({
        ..._.omit(booking, ['time', 'customer', 'stylist', 'firstName']),
        content: bookingSummary(booking, this.userId),
        link: bookingLink(booking, this.userId),
      }));

    return bookings;
  },
  'bookings.conversationSummary': function findBookingForConversationSummary(_id) {
    check(_id, String);

    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const booking = Bookings.findOne(
        { _id, $or: [{ customer: this.userId }, { stylist: this.userId }] },
        {
          fields: {
            services: 1,
            total: 1,
            address: 1,
            time: 1,
            status: 1,
            duration: 1,
            createdAt: 1,
            customer: 1,
            stylist: 1,
            conversation: 1,
            note: 1,
          },
        },
      );

      if (!booking) {
        throw new Meteor.Error(403, 'unauthorized');
      }

      const recipient = Profiles.findOne(
        {
          owner: booking.customer === this.userId ? booking.stylist : booking.customer,
        },
        { fields: { name: 1, photo: 1, owner: 1 } },
      );

      return { ..._.omit(booking, ['customer', 'stylist']), recipient };
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: [
    'bookings.customer.create',
    'bookings.customer.cancel',
    'bookings.guest.find',
    'bookings.customer.find',
    'bookings.customer.list',
    'bookings.stylist.find',
    'bookings.stylist.list',
    'bookings.stylist.confirm.pending',
    'bookings.stylist.decline.pending',
    'bookings.stylist.cancel.confirmed',
    'bookings.stylist.complete.confirmed',
    'bookings.upcoming',
  ],
  limit: 5,
  timeRange: 1000,
});
