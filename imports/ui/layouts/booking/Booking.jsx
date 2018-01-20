import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StripeProvider, Elements } from 'react-stripe-elements';

import { setUserInfo } from '../../../modules/client/redux/cart';
import BookingPage from './BookingPage';
import { validateBooking } from '../../../modules/validate';

class Booking extends Component {
  constructor(props) {
    super(props);

    props.setUserInfo({
      firstName: (props.profile && props.profile.name && props.profile.name.first) || '',
      lastName: (props.profile && props.profile.name && props.profile.name.last) || '',
      email: (props.profile && props.profile.email) || '',
      mobile: (props.profile && props.profile.mobile) || '',
      address: (props.profile && props.profile.address && props.profile.address.raw) || '',
      register: _.isEmpty(props.profile),
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        mobile: (nextProps.profile && nextProps.profile.mobile) || '',
        address:
          (nextProps.profile && nextProps.profile.address && nextProps.profile.address.raw) || '',
        register: _.isEmpty(nextProps.profile),
      });
    }
  }

  handleChange(event) {
    this.props.setUserInfo({ [event.target.name]: event.target.value });
  }

  handleValidate() {
    const {
      email, firstName, lastName, mobile, address, date, time,
    } = this.props.cart;

    const errors = validateBooking(email, firstName, lastName, mobile, address, date, time);

    return errors;
  }

  handleSubmit(stripeToken) {
    // TODO: handle payment
    console.log(stripeToken);

    // TODO: error handling

    // this.props.history.push('booking-confirm');
  }

  handleBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <StripeProvider apiKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh">
        <Elements>
          <BookingPage
            onChange={this.handleChange}
            onValidate={this.handleValidate}
            onSubmit={this.handleSubmit}
            onBack={this.handleBack}
            cart={this.props.cart}
            authenticated={this.props.authenticated}
            history={this.props.history}
          />
        </Elements>
      </StripeProvider>
    );
  }
}

Booking.defaultProps = {
  profile: null,
};

Booking.propTypes = {
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  profile: PropTypes.object,
  setUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  authenticated: state.user.authenticated,
  profile: state.user.profile,
});

export default connect(mapStateToProps, { setUserInfo })(Booking);
