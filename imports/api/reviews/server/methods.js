import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Reviews from '../reviews';
import Stylists from '../../stylists/stylists';
import Bookings from '../../bookings/bookings';
import BookingActivities from '../../booking_activities/booking_activities';
import Profiles from '../../profiles/profiles';
import { sendStylistBookingReviewedEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'reviews.create': function createReview(data) {
    check(data, Object);

    const { _id, rating, review } = data;

    check(_id, String);
    check(rating, Number);
    check(review, String);

    try {
      const { customer, stylist, time } = Bookings.findOne({ _id });

      if (!customer || !stylist) {
        throw new Meteor.Error(404, 'invalid booking number');
      }

      // create Reviews record
      Reviews.insert({
        booking: _id,
        customer,
        stylist,
        rating,
        review,
      });

      // create BookingActivities record
      BookingActivities.insert({
        booking: _id,
        stylist,
        customer,
        user: this.userId,
        action: 'reviewed',
      });

      const { name: customerName } = Profiles.findOne({ owner: customer });

      Meteor.call('notifications.create', {
        recipient: stylist,
        content: `${customerName.first} reviewed a booking with you`,
        type: 'success',
        dismissible: true,
        dismissed: false,
        link: `/users/stylist/bookings/${_id}`,
      });

      // update Stylists record about avgRating and counts
      const stylistRecord = Stylists.findOne({ owner: stylist });
      let reviewsCount = stylistRecord.reviewsCount || 0;
      let averageRating = stylistRecord.averageRating || 0;
      averageRating = (averageRating * reviewsCount + rating) / (reviewsCount + 1);
      reviewsCount += 1;
      Stylists.update({ owner: stylist }, { $set: { reviewsCount, averageRating } });

      // update Bookings record about reviewedAt
      Bookings.update({ _id }, { $set: { customerReviewedAt: Date.now() } });

      // email notify stylist about new review
      const {
        name: stylistName,
        email: stylistEmail,
        timezone: stylistTimezone,
      } = Profiles.findOne({
        owner: stylist,
      });

      sendStylistBookingReviewedEmail({
        stylistFirstName: stylistName.first,
        stylistEmail,
        firstName: customerName.first,
        time,
        bookingId: _id,
        bookingUrl: `users/stylist/bookings/${_id}`,
        rating,
        review,
        timezone: stylistTimezone,
      });
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['reviews.create'],
  limit: 5,
  timeRange: 1000,
});
