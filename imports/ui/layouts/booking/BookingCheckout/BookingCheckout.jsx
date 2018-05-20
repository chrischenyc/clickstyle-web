import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StripeProvider, Elements } from 'react-stripe-elements';
import scriptLoader from 'react-async-script-loader';

import {
  setUserInfo,
  resetCart,
  applyCoupon,
  removeCoupon,
} from '../../../../modules/client/redux/cart';
import BookingCheckoutPage from './BookingCheckoutPage';
import { validateBooking } from '../../../../modules/validate';
import Loading from '../../../components/Loading';

class BookingCheckout extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleVerifyCoupon = this.handleVerifyCoupon.bind(this);

    this.state = {
      loading: false,
      error: '',
      verifyingCoupon: false,
      couponError: '',
    };

    // load user info into cart if logged in
    if (props.authenticated && _.isEmpty(props.cart.email)) {
      const savedCardInfo =
        (props.profile &&
          props.profile.stripeDefaultCardId &&
          props.profile.stripeDefaultCardLast4 &&
          props.profile.stripeDefaultCardName &&
          `${props.profile.stripeDefaultCardName} xxxx xxxx xxxx ${
            props.profile.stripeDefaultCardLast4
          }`) ||
        '';

      props.setUserInfo({
        firstName: (props.profile && props.profile.name && props.profile.name.first) || '',
        lastName: (props.profile && props.profile.name && props.profile.name.last) || '',
        email: (props.profile && props.profile.email) || '',
        mobile: (props.profile && props.profile.mobile) || '',
        address: (props.profile && props.profile.address && props.profile.address.raw) || '',
        savedCardInfo,
        useSavedCard: !_.isEmpty(savedCardInfo),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.profile, nextProps.profile)) {
      const savedCardInfo =
        (nextProps.profile &&
          nextProps.profile.stripeDefaultCardId &&
          nextProps.profile.stripeDefaultCardLast4 &&
          nextProps.profile.stripeDefaultCardName &&
          `${nextProps.profile.stripeDefaultCardName} xxxx xxxx xxxx ${
            nextProps.profile.stripeDefaultCardLast4
          }`) ||
        '';

      this.props.setUserInfo({
        firstName:
          (nextProps.profile && nextProps.profile.name && nextProps.profile.name.first) || '',
        lastName:
          (nextProps.profile && nextProps.profile.name && nextProps.profile.name.last) || '',
        email: (nextProps.profile && nextProps.profile.email) || '',
        mobile: (nextProps.profile && nextProps.profile.mobile) || '',
        address:
          (nextProps.profile && nextProps.profile.address && nextProps.profile.address.raw) || '',
        savedCardInfo,
        useSavedCard: !_.isEmpty(savedCardInfo),
      });
    }
  }

  handleChange(event) {
    if (event.target.name === 'cardType') {
      this.props.setUserInfo({ useSavedCard: event.target.value === 'savedCard' });
    } else {
      this.props.setUserInfo({ [event.target.name]: event.target.value });
    }
  }

  handleValidate() {
    const errors = validateBooking(this.props.cart);

    return errors;
  }

  handleVerifyCoupon() {
    if (_.isEmpty(this.props.cart.coupon)) {
      this.props.removeCoupon();
      this.setState({ couponError: '' });
      return;
    }

    Meteor.call('coupons.verify', this.props.cart.coupon, (error, result) => {
      this.props.removeCoupon();

      if (error) {
        this.setState({ couponError: error.reason });
      } else if (!_.isEmpty(result.error)) {
        this.setState({ couponError: result.error });
      } else if (!result.coupon) {
        this.setState({ couponError: 'invalid coupon code' });
      } else if (result.coupon.minBookingValue > this.props.cart.total) {
        this.setState({ couponError: `minimum booking value ${result.coupon.minBookingValue}` });
      } else {
        this.setState({ couponError: '' });
        this.props.applyCoupon(result.coupon);
      }
    });
  }

  handleSubmit(stripePayload) {
    this.setState({ loading: true });

    Meteor.call(
      'bookings.customer.create',
      { ..._.omit(this.props.cart, ['count', 'discount']), stripePayload },
      (error, result) => {
        if (error) {
          this.setState({ loading: false, error: error.reason });
        } else if (result) {
          const { bookingId, userId } = result;
          this.setState({ loading: false });

          this.props.resetCart();

          let url = `booking-requested/${bookingId}`;
          if (userId) {
            url += `/${userId}`;
          }
          this.props.history.push(url);
        }
      },
    );
  }

  handleBack() {
    this.props.history.goBack();
  }

  render() {
    return this.props.isScriptLoaded && this.props.isScriptLoadSucceed ? (
      <StripeProvider apiKey={Meteor.settings.public.StripePublishableKey}>
        <Elements>
          <BookingCheckoutPage
            onChange={this.handleChange}
            onValidate={this.handleValidate}
            onSubmit={this.handleSubmit}
            onBack={this.handleBack}
            cart={this.props.cart}
            authenticated={this.props.authenticated}
            history={this.props.history}
            loading={this.state.loading}
            error={this.state.error}
            verifyingCoupon={this.state.verifyingCoupon}
            couponError={this.state.couponError}
            onVerifyCoupon={this.handleVerifyCoupon}
          />
        </Elements>
      </StripeProvider>
    ) : (
      <Loading />
    );
  }
}

BookingCheckout.defaultProps = {
  profile: null,
};

BookingCheckout.propTypes = {
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  profile: PropTypes.object,
  setUserInfo: PropTypes.func.isRequired,
  resetCart: PropTypes.func.isRequired,
  applyCoupon: PropTypes.func.isRequired,
  removeCoupon: PropTypes.func.isRequired,
  isScriptLoaded: PropTypes.bool.isRequired,
  isScriptLoadSucceed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  authenticated: state.user.authenticated,
  profile: state.user.profile,
});

export default connect(mapStateToProps, {
  setUserInfo,
  resetCart,
  applyCoupon,
  removeCoupon,
})(scriptLoader('https://js.stripe.com/v3/')(BookingCheckout));
