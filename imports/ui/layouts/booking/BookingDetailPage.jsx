import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, List } from 'semantic-ui-react';

const BookingDetailPage = props => (
  <Container>
    <List>
      <List.Item>Your next booking for {props.booking.stylist}</List.Item>
    </List>
  </Container>
);

BookingDetailPage.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default BookingDetailPage;
