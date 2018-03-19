import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CartSummary from '../../../components/CartSummary';

import { parseDateQueryString, formatDateDisplayString } from '../../../../modules/format-date';

const BookingCheckoutPageSummarySection = props => (
  <div className="boxed-widget opening-hours summary">
    <h3>
      <i className="fa fa-calendar-check-o" /> Booking Summary
    </h3>

    {!_.isNil(props.cart.stylist) && (
      <h3>
        {`${props.cart.stylist.name.first} ${props.cart.stylist.name.last}`}
        {props.cart.stylist.address &&
          props.cart.stylist.address.suburb &&
          ` (${props.cart.stylist.address.suburb}, ${props.cart.stylist.address.state})`}
      </h3>
    )}

    <ul>
      <li>
        Date{' '}
        <span>
          {parseDateQueryString(props.cart.date).isValid() &&
            formatDateDisplayString(parseDateQueryString(props.cart.date))}
        </span>
      </li>
      <li>
        Time <span>{props.cart.time}</span>
      </li>
    </ul>

    <div className="booking margin-top-10">
      <CartSummary />
    </div>
  </div>
);

BookingCheckoutPageSummarySection.propTypes = {
  cart: PropTypes.object.isRequired,
};

export default BookingCheckoutPageSummarySection;
