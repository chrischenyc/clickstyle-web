import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

const BookingRequestedPage = props => (
  <Container text>
    <div className="booking-confirmation-page">
      <i className="fa fa-check-circle" />
      <h2 className="margin-top-30">
        Thanks heaps for booking with {Meteor.settings.public.appName}!
      </h2>
      <p>Your booking number is {props.booking._id}.</p>
      <p>
        The team at {Meteor.settings.public.appName} will shortly send you an email confirmation. If
        you have any queries in the meantime, then please don&apos;t hesitate to{' '}
        <Link to="/contact">contact us</Link>.
      </p>

      <Link to="/faq" className="button margin-top-30">
        Frequently Asked Questions
      </Link>
    </div>
  </Container>
);

BookingRequestedPage.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default BookingRequestedPage;
