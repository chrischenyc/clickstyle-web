import React from 'react';
import PropTypes from 'prop-types';

import formatPrice from '../../../../modules/format-price';
import { dateTimeString } from '../../../../modules/format-date';
import servicesSummary from '../../../../modules/format-services';

const ConversationBookingSummary = props => (
  <div>
    <div className="inner-booking-list">
      <h5>Booking Number:</h5>
      <ul className="booking-list">
        <li className="highlighted">{props.booking._id}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Status:</h5>
      <ul className="booking-list">
        <li className="highlighted">{props.booking.status}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Date:</h5>
      <ul className="booking-list">
        <li className="highlighted">{dateTimeString(props.booking.time)}</li>
      </ul>
    </div>

    <div className="inner-booking-list">
      <h5>Details:</h5>
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
      <h5>Address:</h5>
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
  </div>
);

ConversationBookingSummary.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default ConversationBookingSummary;
