import React, { Component } from 'react';

import BookingPage from './BookingPage';

class Booking extends Component {
  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleConfirm() {
    // TODO: handle payment

    this.props.history.push('booking-confirm');
  }

  render() {
    return <BookingPage onConfirm={this.handleConfirm} />;
  }
}

export default Booking;
