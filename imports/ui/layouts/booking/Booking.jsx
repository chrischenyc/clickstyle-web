import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { setUserInfo } from '../../../modules/client/redux/cart';
import BookingPage from './BookingPage';

class Booking extends Component {
  constructor(props) {
    super(props);

    if (props.authenticated) {
      props.setUserInfo({
        firstName: (props.profile && props.profile.name && props.profile.name.first) || '',
        lastName: (props.profile && props.profile.name && props.profile.name.last) || '',
        email: (props.profile && props.profile.email) || '',
        phone: (props.profile && props.profile.mobile) || '',
        address: (props.profile && props.profile.address && props.profile.address.raw) || '',
      });
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.profile, nextProps.profile)) {
      this.props.setUserInfo({
        firstName:
          (nextProps.profile && nextProps.profile.name && nextProps.profile.name.first) || '',
        lastName:
          (nextProps.profile && nextProps.profile.name && nextProps.profile.name.last) || '',
        email: (nextProps.profile && nextProps.profile.email) || '',
        phone: (nextProps.profile && nextProps.profile.mobile) || '',
        address:
          (nextProps.profile && nextProps.profile.address && nextProps.profile.address.raw) || '',
      });
    }
  }

  handleChange(event) {
    this.props.setUserInfo({ [event.target.name]: event.target.value });
  }

  handleConfirm() {
    // TODO: form validation

    // TODO: handle payment

    // TODO: error handling

    this.props.history.push('booking-confirm');
  }

  handleBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <BookingPage
        onChange={this.handleChange}
        onConfirm={this.handleConfirm}
        onBack={this.handleBack}
        cart={this.props.cart}
        authenticated={this.props.authenticated}
        history={this.props.history}
      />
    );
  }
}

Booking.propTypes = {
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  authenticated: state.user.authenticated,
  profile: state.profile,
});

export default connect(mapStateToProps, { setUserInfo })(Booking);
