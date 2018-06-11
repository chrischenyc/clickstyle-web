import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StripeProvider, Elements } from 'react-stripe-elements';
import scriptLoader from 'react-async-script-loader';
import moment from 'moment';

import {
  setUserInfo,
  resetCart,
  setCoupon,
  removeCoupon,
} from '../../../../modules/client/redux/cart';
import BookingCheckoutPage from './BookingCheckoutPage';
import { validateBooking } from '../../../../modules/validate';
import Loading from '../../../components/Loading';

/**
 * profile: Redux reducer user.profile
 * updateFunc: Redux reducer user.setUserInfo function
 */
const updateCartWithUserInfo = (profile, updateFunc) => {
  const savedCardInfo =
    (profile &&
      profile.stripeDefaultCardId &&
      profile.stripeDefaultCardLast4 &&
      profile.stripeDefaultCardName &&
      `${profile.stripeDefaultCardName} xxxx xxxx xxxx ${profile.stripeDefaultCardLast4}`) ||
    '';

  updateFunc({
    firstName: (profile && profile.name && profile.name.first) || '',
    lastName: (profile && profile.name && profile.name.last) || '',
    email: (profile && profile.email) || '',
    mobile: (profile && profile.mobile) || '',
    address: (profile && profile.address && profile.address.raw) || '',
    savedCardInfo,
    useSavedCard: !_.isEmpty(savedCardInfo),
  });
};

class BookingCheckout extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleVerifyCoupon = this.handleVerifyCoupon.bind(this);
    this.handleStripeError = this.handleStripeError.bind(this);
    this.handleStripeLoading = this.handleStripeLoading.bind(this);

    this.state = {
      loading: false,
      errors: {},
      verifyingCoupon: false,
    };

    // load user info into cart if user is logged in
    if (props.authenticated && _.isEmpty(props.cart.email)) {
      updateCartWithUserInfo(props.profile, props.setUserInfo);
    }
  }

  componentDidMount() {
    this.handleVerifyCoupon();
  }

  componentWillReceiveProps(nextProps) {
    // refresh user info in cart if user login status changed
    if (!_.isEqual(this.props.profile, nextProps.profile)) {
      updateCartWithUserInfo(nextProps.profile, this.props.setUserInfo);
    }
  }

  handleChange(event) {
    if (event.target.name === 'cardType') {
      this.props.setUserInfo({ useSavedCard: event.target.value === 'savedCard' });
    } else {
      this.props.setUserInfo({ [event.target.name]: event.target.value });

      // remove previous error once user starts editing the field
      this.setState({ errors: _.omit(this.state.errors, event.target.name) });
    }
  }

  handleValidate() {
    const errors = validateBooking(this.props.cart);

    this.setState({ errors });

    return _.isEmpty(errors);
  }

  handleVerifyCoupon() {
    if (_.isEmpty(this.props.cart.couponCode)) {
      this.props.removeCoupon();
      this.setState({ errors: _.omit(this.state.errors, 'couponCode') });

      return;
    }

    Meteor.call('coupons.verify', this.props.cart.couponCode, (error, coupon) => {
      if (error) {
        this.props.removeCoupon();
      } else {
        this.props.setCoupon(coupon);

        if (_.isEmpty(coupon.error)) {
          this.setState({ errors: _.omit(this.state.errors, 'couponCode') });
        } else {
          this.setState({
            errors: { ...this.state.errors, couponCode: coupon.error },
          });
        }
      }
    });
  }

  handleStripeError(error) {
    this.setState({ errors: { ...this.state.errors, stripe: error } });
  }

  handleStripeLoading(loading) {
    this.setState({ loading });
  }

  handleSubmit(stripePayload) {
    this.setState({ loading: true });

    Meteor.call(
      'bookings.customer.create',
      {
        ..._.omit(this.props.cart, ['total', 'count', 'coupon', 'savedCardInfo', 'date', 'time']),
        stripePayload,
        time: moment(this.props.cart.date + this.props.cart.time, 'YYMMDDHH:mm').toDate(),
      },
      (error, result) => {
        if (error) {
          this.setState({ loading: false, errors: { submit: error.reason } });
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
            errors={this.state.errors}
            verifyingCoupon={this.state.verifyingCoupon}
            onVerifyCoupon={this.handleVerifyCoupon}
            onStripeError={this.handleStripeError}
            onStripeLoading={this.handleStripeLoading}
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
  setCoupon: PropTypes.func.isRequired,
  removeCoupon: PropTypes.func.isRequired,
  isScriptLoaded: PropTypes.bool.isRequired,
  isScriptLoadSucceed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  authenticated: state.user.authenticated,
  profile: state.user.profile,
});

export default connect(
  mapStateToProps,
  {
    setUserInfo,
    resetCart,
    setCoupon,
    removeCoupon,
  },
)(scriptLoader('https://js.stripe.com/v3/')(BookingCheckout));
