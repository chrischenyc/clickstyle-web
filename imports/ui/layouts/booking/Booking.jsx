import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import BookingPage from './BookingPage';

class Booking extends Component {
  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  handleConfirm() {
    // TODO: handle payment
    this.props.history.push('booking-confirm');
  }

  handleBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <BookingPage
        onConfirm={this.handleConfirm}
        onBack={this.handleBack}
        cart={this.props.cart}
        user={this.props.user}
        profile={this.props.profile}
      />
    );
  }
}

Booking.propTypes = {
  cart: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  user: state.user,
  profile: state.profile,
});

export default connect(mapStateToProps)(Booking);
