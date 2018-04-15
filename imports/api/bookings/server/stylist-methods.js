import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
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
import BookingActivities from '../../booking_activities/booking_activities';
import Payments from '../../payments/payments';
import Reviews from '../../reviews/reviews';
import { dateTimeString } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';
import chargeCustomer from '../../../modules/server/charge-customer';
import formatOccupiedTimeSlot from '../../../modules/server/format-occupied-time-slot';

const canStylistCompleteBooking = (booking) => {
  if (booking.status !== 'confirmed') {
    return false;
  }

  const bookingStartDateTime = moment(booking.time);
  const bookingEndDateTime = bookingStartDateTime.clone().add(booking.duration - 1, 'minutes');

  return bookingEndDateTime.isBefore(moment());
};

export function stylistConfirmPendingBooking(_id) {
  check(_id, String);

  if (!this.userId || !Roles.userIsInRole(this.userId, [Meteor.settings.public.roles.stylist])) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  try {
    const booking = Bookings.findOne({ _id, stylist: this.userId });
    if (!booking) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    // if bookingTime was in the past, throw Error
    const bookingStartDateTime = moment(booking.time);
    if (bookingStartDateTime.isBefore(moment())) {
      throw new Meteor.Error('the booking time was in the past, cannot proceed');
    }

    // stylist calendar availability validation
    const bookingEndDateTime = bookingStartDateTime.clone().add(booking.duration - 1, 'minutes');
    const bookingStartTimeslot = parseInt(bookingStartDateTime.format('YYMMDDHHmm'), 10);
    const bookingEndTimeslot = parseInt(bookingEndDateTime.format('YYMMDDHHmm'), 10);
    const { occupiedTimeSlots } = Stylists.findOne({ owner: this.userId });
    const conflictedSlots = occupiedTimeSlots.filter(occupiedSlot =>
      (occupiedSlot.from >= bookingStartTimeslot && occupiedSlot.from < bookingEndTimeslot) ||
        (occupiedSlot.to > bookingStartTimeslot && occupiedSlot.to <= bookingEndTimeslot) ||
        (occupiedSlot.from <= bookingStartTimeslot && occupiedSlot.to >= bookingEndTimeslot));

    if (conflictedSlots.length > 0) {
      let message = 'cannot confirm this booking due to time conflicts on your calendar: ';
      conflictedSlots.forEach((timeslot, index) => {
        message += `• ${formatOccupiedTimeSlot(timeslot)}`;
        if (index < conflictedSlots.length - 1) {
          message += ' ';
        }
      });

      throw new Meteor.Error(message);
    }

    // update bookings record, insert timestamp
    Bookings.update(
      { _id, stylist: this.userId },
      { $set: { status: 'confirmed', stylistConfirmedAt: Date.now() } },
    );

    // create BookingActivities record
    BookingActivities.insert({
      booking: _id,
      stylist: booking.stylist,
      customer: booking.customer,
      user: this.userId,
      action: 'confirmed',
    });

    // send notification to customer
    const { name: stylistName } = Stylists.findOne({ owner: this.userId });

    Meteor.call('notifications.create', {
      recipient: booking.customer,
      content: `${stylistName.first} confirmed your booking request`,
      type: 'success',
      dismissible: true,
      dismissed: false,
      link: `/users/bookings/${_id}`,
    });

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

    const {
      services, total, firstName, lastName, email, mobile, address, time,
    } = booking;
    sendCustomerBookingConfirmedEmail({
      stylist: `${stylistName.first} ${stylistName.last}`,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: dateTimeString(time),
      bookingId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export function stylistDeclinePendingBooking(_id) {
  check(_id, String);

  if (!this.userId || !Roles.userIsInRole(this.userId, [Meteor.settings.public.roles.stylist])) {
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

    // create BookingActivities record
    BookingActivities.insert({
      booking: _id,
      stylist: booking.stylist,
      customer: booking.customer,
      user: this.userId,
      action: 'declined',
    });

    // send notification to customer
    const { name: stylistName } = Stylists.findOne({ owner: this.userId });

    Meteor.call('notifications.create', {
      recipient: booking.customer,
      content: `${stylistName.first} declined your booking request`,
      type: 'warning',
      dismissible: true,
      dismissed: false,
      link: `/users/bookings/${_id}`,
    });

    // notify customer
    const {
      services, total, firstName, lastName, email, mobile, address, time,
    } = booking;
    sendCustomerBookingDeclinedEmail({
      stylist: `${stylistName.first} ${stylistName.last}`,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: dateTimeString(time),
      bookingId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });
  } catch (exception) {
    log.error(exception);

    throw exception;
  }
}

export function stylistCancelConfirmedBooking(_id) {
  check(_id, String);

  if (!this.userId || !Roles.userIsInRole(this.userId, [Meteor.settings.public.roles.stylist])) {
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

    // create BookingActivities record
    BookingActivities.insert({
      booking: _id,
      stylist: booking.stylist,
      customer: booking.customer,
      user: this.userId,
      action: 'cancelled',
    });

    // send notification to customer
    const { name: stylistName } = Stylists.findOne({ owner: this.userId });

    Meteor.call('notifications.create', {
      recipient: booking.customer,
      content: `${stylistName.first} cancelled a booking with you`,
      type: 'error',
      dismissible: true,
      dismissed: false,
      link: `/users/bookings/${_id}`,
    });

    // unblock occupied timeslots
    Stylists.update(
      { owner: booking.stylist },
      { $pull: { occupiedTimeSlots: { bookingId: _id } } },
    );

    // notify customer
    const {
      services, total, firstName, lastName, email, mobile, address, time,
    } = booking;

    sendCustomerBookingCancelledByStylistEmail({
      stylist: `${stylistName.first} ${stylistName.last}`,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: dateTimeString(time),
      bookingId: _id,
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

  if (!this.userId || !Roles.userIsInRole(this.userId, [Meteor.settings.public.roles.stylist])) {
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

    // create BookingActivities record
    BookingActivities.insert({
      booking: _id,
      stylist: booking.stylist,
      customer: booking.customer,
      user: this.userId,
      action: 'completed',
    });

    // send notification to customer
    const { name: stylistName, email: stylistEmail } = Stylists.findOne({ owner: this.userId });

    Meteor.call('notifications.create', {
      recipient: booking.customer,
      content: `${stylistName.first} marked a booking with you as completed`,
      type: 'success',
      dismissible: true,
      dismissed: false,
      link: `/users/bookings/${_id}`,
    });

    // notify customer
    const {
      services, total, firstName, lastName, email, mobile, address, time,
    } = booking;

    sendCustomerBookingCompletedEmail({
      stylist: `${stylistName.first} ${stylistName.last}`,
      services: servicesSummary(services),
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time: dateTimeString(time),
      bookingId: _id,
      bookingUrl: `users/bookings/${_id}`,
    });

    // notify stylist
    sendStylistBookingCompletedEmail({
      stylistFirstName: stylistName.first,
      stylistEmail,
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

  if (!this.userId || !Roles.userIsInRole(this.userId, [Meteor.settings.public.roles.stylist])) {
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

export function stylistListBookings(bookingStatus) {
  check(bookingStatus, Match.Maybe(String));

  if (!this.userId || !Roles.userIsInRole(this.userId, [Meteor.settings.public.roles.stylist])) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  let selector = { stylist: this.userId };
  if (bookingStatus) {
    selector = { ...selector, status: bookingStatus };
  }

  try {
    let bookings = Bookings.find(selector, {
      fields: {
        services: 1,
        total: 1,
        customer: 1,
        firstName: 1,
        lastName: 1,
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
      const customer = Profiles.findOne({ owner: booking.customer }, { fields: { photo: 1 } });
      const review = Reviews.findOne({ booking: booking._id }, { fields: { rating: 1 } });
      return { ...booking, customer, review };
    });
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
