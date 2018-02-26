import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BookingConfirmPage = props => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <div className="booking-confirmation-page">
          <i className="fa fa-check-circle" />
          <h2 className="margin-top-30">Thanks for your booking!</h2>
          <p>
            Your booking number is {props.booking._id}. You&apos;ll receive a confirmation email
          </p>
          <p>TODO: copy writing what's next</p>
          <Link to="/help" className="button margin-top-30">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  </div>
);

BookingConfirmPage.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default BookingConfirmPage;
