import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Button, Responsive, Checkbox } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe,
} from 'react-stripe-elements';
import classNames from 'classnames';

import SemanticGeoSuggest from '../../components/SemanticGeoSuggest/SemanticGeoSuggest';
import ModalLink from '../../components/ModalLink';
import Login from '../user/Login/Login';
import BookingPageSummarySection from './BookingPageSummarySection';
import { FormFieldErrorMessage } from '../../components/FormInputField';
import { withMediaQuery } from '../../components/HOC';

class BookingPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = { errors: {}, loading: false };
  }

  handleSubmit() {
    // 1. validate form
    const errors = this.props.onValidate();
    this.setState({ errors });

    if (_.isEmpty(errors)) {
      // 2. get Stripe token
      this.setState({ loading: true });
      if (this.props.stripe) {
        this.props.stripe
          .createToken()
          .then((payload) => {
            this.setState({ loading: false });
            // 3. inform container component to handle payment
            this.props.onSubmit(payload);
          })
          .catch((error) => {
            this.setState({ loading: false });
            console.log(error);

            // TODO: convert stripe error to field error
            this.setState({
              errors: { ...this.state.errors, form: error },
            });
          });
      } else {
        this.setState({ errors: { ...this.state.errors, form: "Stripe.js hasn't loaded yet." } });
      }
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row margin-top-50 margin-bottom-50">
          <div
            className={classNames({
              'col-lg-8 col-md-8 padding-right-30': this.props.screenWidth > 1024,
              'col-12': this.props.screenWidth <= 1024,
            })}
          >
            <Responsive maxWidth={1024} className="margin-bottom-20">
              <BookingPageSummarySection cart={this.props.cart} />
            </Responsive>

            <form>
              <h3 className="margin-top-0 margin-bottom-30">Personal Details</h3>

              {!this.props.authenticated && (
                <div className="margin-top-10 margin-bottom-20">
                  Already a user?&nbsp;
                  <Responsive
                    minWidth={1025}
                    as={ModalLink}
                    to="/login"
                    component={<Login modal />}
                    title="Log in to continue"
                  >
                    Log In
                  </Responsive>
                  <Responsive maxWidth={1024} as={Link} to="/login">
                    Log In
                  </Responsive>
                  &nbsp;to continue
                </div>
              )}

              <div className="row">
                <div className="col-md-6">
                  <label>First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    value={this.props.cart.firstName}
                    onChange={this.props.onChange}
                  />
                  <div>
                    <FormFieldErrorMessage
                      compact
                      message={this.state.errors.firstName}
                      style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label>Last Name</label>
                  <input
                    name="lastName"
                    type="text"
                    value={this.props.cart.lastName}
                    onChange={this.props.onChange}
                  />
                </div>

                <div className="col-md-6">
                  <label>Email</label>
                  <input
                    name="email"
                    type="text"
                    value={this.props.cart.email}
                    onChange={this.props.onChange}
                  />
                </div>

                <div className="col-md-6">
                  <label>Mobile</label>
                  <input
                    name="mobile"
                    type="text"
                    value={this.props.cart.phone}
                    onChange={this.props.onChange}
                  />
                </div>

                <div className="col-md-12">
                  <label>Address</label>
                  <SemanticGeoSuggest
                    placeholder="type to search your address"
                    country="au"
                    name="address.raw"
                    initialValue=""
                    onChange={(value) => {
                      // convert to generic onChange param
                      this.props.onChange({ target: { name: 'address', value } });
                    }}
                    onSuggestSelect={(suggest) => {
                      // force onChange as well
                      this.props.onChange({ target: { name: 'address', value: suggest.label } });
                    }}
                  />
                </div>

                {!this.props.authenticated && (
                  <div className="col-md-12">
                    <Checkbox
                      className="margin-top-20"
                      defaultChecked
                      name="register"
                      onChange={(event, data) => {
                        this.props.onChange({ target: { name: 'register', value: data.checked } });
                      }}
                      label={<label>also sign me up with {Meteor.settings.public.appName}</label>}
                    />
                  </div>
                )}
              </div>

              <h3 className="margin-top-55 margin-bottom-30">Payment Method</h3>

              <div className="payment">
                <p>You will only be charged after service is complete.</p>

                <div className="payment-tab payment-tab-active">
                  <div className="payment-tab-trigger">
                    <input
                      checked
                      disabled
                      type="radio"
                      name="cardType"
                      id="creditCart"
                      value="creditCard"
                    />
                    <label htmlFor="creditCart">Credit / Debit Card</label>
                    {/* TODO: host card logo png on CDN */}
                    <img className="payment-logo" src="https://i.imgur.com/IHEKLgm.png" alt="" />
                  </div>

                  <div className="payment-tab-content">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="card-label">
                          <label>Name on Card</label>
                          <input name="nameOnCard" type="text" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="card-label">
                          <label>Card number</label>
                          <CardNumberElement placeholder="" />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="card-label">
                          <label>Expiration</label>
                          <CardExpiryElement />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="card-label">
                          <label>CVC</label>
                          <CardCVCElement placeholder="" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <Checkbox
                        style={{ padding: '0 20px' }}
                        defaultChecked
                        name="saveCard"
                        onChange={(event, data) => {
                          this.props.onChange({
                            target: { name: 'saveCard', value: data.checked },
                          });
                        }}
                        label={<label>save this card</label>}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="margin-top-20">
                <Button
                  loading={this.state.loading}
                  type="button"
                  color="teal"
                  circular
                  size="large"
                  disabled={this.props.cart.total === 0}
                  onClick={this.handleSubmit}
                >
                  Confirm and Pay
                </Button>

                <Button
                  color="teal"
                  circular
                  size="large"
                  basic
                  onClick={this.props.onBack}
                  disabled={this.state.loading}
                >
                  Go back
                </Button>
              </div>
            </form>
          </div>

          <Responsive minWidth={1025} className="col-lg-4 col-md-4">
            <BookingPageSummarySection cart={this.props.cart} />
          </Responsive>
        </div>
      </div>
    );
  }
}

BookingPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  stripe: PropTypes.object.isRequired,
  screenWidth: PropTypes.number.isRequired,
};

export default injectStripe(withMediaQuery(BookingPage));
