import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import formatPrice from '../../../modules/format-price';
import { dateTimeString, parseBookingDateTime } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';
import { Rating } from 'semantic-ui-react';

const BookingSummary = props => (
  <Fragment>
    <div className="inner-booking-list">
      <h5>Booking Date:</h5>
      <ul className="booking-list">
        <li className="highlighted">
          {dateTimeString(parseBookingDateTime(props.booking.date + props.booking.time))}
        </li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Booking Details:</h5>
      <ul className="booking-list">
        <li className="highlighted">{servicesSummary(props.booking.services)}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Total:</h5>
      <ul className="booking-list">
        <li className="highlighted">{formatPrice(props.booking.total)}</li>
      </ul>
    </div>

    {props.booking.review && (
      <div className="inner-booking-list">
        <h5>Review:</h5>
        <ul className="booking-list">
          <li className="highlighted">
            <Rating
              icon="star"
              maxRating={5}
              defaultRating={props.booking.review.rating}
              disabled
            />
          </li>
        </ul>
      </div>
    )}
  </Fragment>
);

BookingSummary.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default BookingSummary;
