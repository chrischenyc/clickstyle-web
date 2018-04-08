import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StripeProvider, Elements } from 'react-stripe-elements';
import scriptLoader from 'react-async-script-loader';

import { setUserInfo, resetCart } from '../../../../modules/client/redux/cart';
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

    this.state = {
      loading: false,
      error: '',
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

  handleSubmit(stripePayload) {
    this.setState({ loading: true });

    Meteor.call(
      'bookings.customer.create',
      { ..._.omit(this.props.cart, ['showCartInHeader', 'count']), stripePayload },
      (error, result) => {
        if (error) {
          this.setState({ loading: false, error: error.reason.error });
        } else if (result) {
          const { bookingsId, userId } = result;
          this.setState({ loading: false });

          this.props.resetCart();

          let url = `booking-requested/${bookingsId}`;
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
  isScriptLoaded: PropTypes.bool.isRequired,
  isScriptLoadSucceed: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
  authenticated: state.user.authenticated,
  profile: state.user.profile,
});

export default connect(mapStateToProps, { setUserInfo, resetCart })(scriptLoader('https://js.stripe.com/v3/')(BookingCheckout));
