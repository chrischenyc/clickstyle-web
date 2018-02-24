import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StripeProvider, Elements } from 'react-stripe-elements';
import scriptLoader from 'react-async-script-loader';

import { setUserInfo } from '../../../modules/client/redux/cart';
import BookingPage from './BookingPage';
import { validateBooking } from '../../../modules/validate';

class Booking extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.state = {
      loading: false,
    };
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
    const errors = validateBooking(this.props.cart);

    return errors;
  }

  handleSubmit(stripePayload) {
    this.setState({ loading: true });

    Meteor.call(
      'bookings.create',
      { ..._.omit(this.props.cart, 'showCartInHeader'), stripePayload },
      (error, success) => {
        if (error) {
          console.log('error', error);
        }
        if (success) {
        }
      },
    );

    // this.props.history.push('booking-confirm');
  }

  handleBack() {
    this.props.history.goBack();
  }

  render() {
    return this.props.isScriptLoaded && this.props.isScriptLoadSucceed ? (
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
            loading={this.state.loading}
          />
        </Elements>
      </StripeProvider>
    ) : (
      ''
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
  isScriptLoaded: PropTypes.bool.isRequired,
  isScriptLoadSucceed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  authenticated: state.user.authenticated,
  profile: state.user.profile,
});

export default connect(mapStateToProps, { setUserInfo })(scriptLoader('https://js.stripe.com/v3/')(Booking));
