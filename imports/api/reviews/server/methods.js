import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Reviews from '../reviews';
import Stylists from '../../stylists/stylists';
import Bookings from '../../bookings/bookings';
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
      const { customer, stylist } = Bookings.findOne({ _id });

      if (!customer || !stylist) {
        throw new Meteor.Error(404, 'invalid booking number');
      }

      Reviews.insert({
        booking: _id,
        customer,
        stylist,
        rating,
        review,
      });

      const stylistRecord = Stylists.findOne({ owner: stylist });
      let reviewsCount = stylistRecord.reviewsCount || 0;
      let averageRating = stylistRecord.averageRating || 0;
      averageRating = (averageRating * reviewsCount + rating) / (reviewsCount + 1);
      reviewsCount += 1;
      Stylists.update({ owner: stylist }, { $set: { reviewsCount, averageRating } });

      const { name: stylistName, email: stylistEmail } = Profiles.findOne({
        owner: stylist,
      });
      const { name: customerName } = Profiles.findOne({ owner: customer });
      sendStylistBookingReviewedEmail({
        stylistFirstName: stylistName.first,
        stylistEmail,
        firstName: customerName.first,
        bookingsId: _id,
        bookingUrl: `users/stylist/bookings/${_id}`,
        rating,
        review,
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
