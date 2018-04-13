import { Meteor } from 'meteor/meteor';
import _ from 'lodash';
import moment from 'moment';

import rateLimit from '../../../modules/server/rate-limit';
import BookingActivities from '../../booking_activities/booking_activities';
import Profiles from '../../profiles/profiles';

function bookingActivitySummary(activity, userId) {
  if (activity.user === userId) {
    return `You ${activity.action} a booking`;
  } else if (activity.user === 'system') {
    return `System ${activity.action} a booking`;
  }

  const { name } = Profiles.findOne({ owner: activity.user });

  return `${name.first} ${activity.action} a booking`;
}

function bookingActivityLink(activity, userId) {
  if (activity.customer === userId) {
    return `/users/bookings/${activity.booking}`;
  }

  return `/users/stylist/bookings/${activity.booking}`;
}

Meteor.methods({
  'booking.activities.recent': function usersRecentActivities() {
    if (!this.userId) {
      throw new Meteor.Error('403');
    }

    const activities = BookingActivities.find(
      {
        createdAt: {
          $gte: moment()
            .subtract(7, 'days')
            .toDate(),
        },
        $or: [{ customer: this.userId }, { stylist: this.userId }],
      },
      {
        limit: 10,
        sort: { createdAt: -1 },
      },
    )
      .fetch()
      .map(activity => ({
        ..._.omit(activity, ['booking', 'customer', 'stylist', 'user']),
        content: bookingActivitySummary(activity, this.userId),
        link: bookingActivityLink(activity, this.userId),
      }));

    return activities;
  },
});

rateLimit({
  methods: ['booking.activities.recent'],
  limit: 5,
  timeRange: 1000,
});
