import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';
import moment from 'moment';

import {
  sendCustomerBookingConfirmedEmail,
  sendCustomerBookingDeclinedEmail,
  sendCustomerBookingCancelledByStylistEmail,
  sendCustomerBookingCompletedEmail,
  sendStylistBookingCompletedEmail,
  sendAdminConfirmedBookingCancelledByStylistEmail,
} from '../../../modules/server/send-email';

import Stylists from '../../stylists/stylists';
import Profiles from '../../profiles/profiles';
import Bookings from '../bookings';
import Payments from '../../payments/payments';
import Reviews from '../../reviews/reviews';
import { parseBookingDateTime, dateTimeString } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';
import chargeCustomer from '../../../modules/server/charge-customer';

const canStylistCompleteBooking = (booking) => {
  if (booking.status !== 'confirmed') {
    return false;
  }

  const bookingStartDateTime = parseBookingDateTime(booking.date + booking.time);
  const bookingEndDateTime = moment(bookingStartDateTime).add(booking.duration, 'minutes');

  return bookingEndDateTime.isBefore(moment());
};

export function stylistConfirmPendingBooking(_id) {
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
      time: dateTimeString(parseBookingDateTime(date + time)),
      bookingsId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export function stylistDeclinePendingBooking(_id) {
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
      time: dateTimeString(parseBookingDateTime(date + time)),
      bookingsId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export function stylistCancelConfirmedBooking(_id) {
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

    // unblock occupied timeslots
    Stylists.update(
      { owner: booking.stylist },
      { $pull: { occupiedTimeSlots: { bookingId: _id } } },
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
      time: dateTimeString(parseBookingDateTime(date + time)),
      bookingsId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });

    // notify admin
    sendAdminConfirmedBookingCancelledByStylistEmail(_id);
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export async function stylistCompleteConfirmedBooking(_id) {
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
      { $set: { status: 'completed', stylistCompletedAt: Date.now() } },
    );

    // notify customer
    const stylist = Profiles.findOne({ owner: this.userId });
    const {
      services, total, firstName, lastName, email, mobile, address, date, time,
    } = booking;

    sendCustomerBookingCompletedEmail({
      stylist: `${stylist.name.first} ${stylist.name.last}`,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: dateTimeString(parseBookingDateTime(date + time)),
      bookingsId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });

    // notify stylist
    sendStylistBookingCompletedEmail({
      stylistFirstName: stylist.name.first,
      stylistEmail: stylist.email,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: dateTimeString(parseBookingDateTime(date + time)),
      bookingsId: _id,
      bookingUrl: `users/stylist/bookings/${_id}`,
    });

    // charge customer
    chargeCustomer(
      booking,
      booking.total,
      `booking completed: ${booking._id}`,
      `Booking completed with total charge ${booking.total}`,
    );
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export function stylistFindBooking(_id) {
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

    const customer = Profiles.findOne(
      { owner: booking.customer },
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

    return {
      ...booking,
      customer,
      payments,
      review,
      canBeCompleted: canStylistCompleteBooking(booking),
    };
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}

export function stylistListBookings() {
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
      const review = Reviews.findOne({ booking: booking._id }, { fields: { rating: 1 } });
      return { ...booking, customer, review };
    });
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
