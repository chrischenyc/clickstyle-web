import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import formatPrice from '../../../modules/format-price';
import { dateTimeString } from '../../../modules/format-date';
import servicesSummary from '../../../modules/format-services';

const BookingSummary = props => (
  <Fragment>
    <div className="inner-booking-list">
      <h5>Booking Number:</h5>
      <ul className="booking-list">
        <li className="highlighted">{props.booking._id}</li>
      </ul>
    </div>

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
      <h5>Estimated Duration:</h5>
      <ul className="booking-list">
        <li className="highlighted">{`${props.booking.duration} mins`}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Total:</h5>
      <ul className="booking-list">
        <li className="highlighted">{formatPrice(props.booking.total)}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Customer:</h5>
      <ul className="booking-list">
        <li className="highlighted">{`${props.booking.firstName} ${props.booking.lastName}`}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Customer address:</h5>
      <ul className="booking-list">
        <li className="highlighted">{props.booking.address}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Note:</h5>
      <ul className="booking-list">
        <li className="highlighted">{props.booking.note}</li>
      </ul>
    </div>
  </Fragment>
);

BookingSummary.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default BookingSummary;
