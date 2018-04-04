import { Meteor } from 'meteor/meteor';

import rateLimit from '../../../modules/server/rate-limit';

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
  stylistFindBooking,
  stylistListBookings,
} from './stylist-methods';

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
  ],
  limit: 5,
  timeRange: 1000,
});
