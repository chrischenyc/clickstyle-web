import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { dateTimeString } from '../../../modules/format-date';
import formatPrice from '../../../modules/format-price';

const BookingStatus = props => (
  <Fragment>
    {props.booking.createdAt && (
      <div className="inner-booking-list">
        <h5>Booking requested:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.createdAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.stylistConfirmedAt && (
      <div className="inner-booking-list">
        <h5>Stylist confirmed:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.stylistConfirmedAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.stylistDeclinedAt && (
      <div className="inner-booking-list">
        <h5>Stylist declined:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.stylistDeclinedAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.stylistCancelledAt && (
      <div className="inner-booking-list">
        <h5>Stylist cancelled:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.stylistCancelledAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.systemCancelledAt && (
      <div className="inner-booking-list">
        <h5>System cancelled:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.systemCancelledAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.customerCancelledAt && (
      <div className="inner-booking-list">
        <h5>Customer cancelled:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.customerCancelledAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.stylistCompletedAt && (
      <div className="inner-booking-list">
        <h5>Booking completed:</h5>
        <ul className="booking-list">
          <li className="highlighted">{dateTimeString(props.booking.stylistCompletedAt)}</li>
        </ul>
      </div>
    )}

    {props.booking.payments.map(payment => (
      <div className="inner-booking-list" key={payment._id}>
        <h5>Payment:</h5>
        <ul className="booking-list">
          <li className="highlighted">
            {`${dateTimeString(payment.createdAt)} - ${formatPrice(payment.amount)} (${
              payment.description
            })`}
          </li>
        </ul>
      </div>
    ))}
  </Fragment>
);

BookingStatus.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default BookingStatus;
