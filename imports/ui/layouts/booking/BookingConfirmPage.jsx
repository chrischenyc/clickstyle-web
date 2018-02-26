import React from 'react';
import { Link } from 'react-router-dom';

const BookingConfirmPage = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <div className="booking-confirmation-page">
          <i className="fa fa-check-circle" />
          <h2 className="margin-top-30">Thanks for your booking!</h2>
          <p>You&apos;ll receive a confirmation email</p>
          <p>TODO: copy writing what's next</p>
          <Link to="/help" className="button margin-top-30">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default BookingConfirmPage;
