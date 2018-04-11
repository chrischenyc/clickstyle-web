import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Rating } from 'semantic-ui-react';

import formatPrice from '../../../modules/format-price';
import { dateTimeString } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';

const BookingSummary = props => (
  <Fragment>
    <div className="inner-booking-list">
      <h5>Booking Date:</h5>
      <ul className="booking-list">
        <li className="highlighted">{dateTimeString(props.booking.time)}</li>
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
