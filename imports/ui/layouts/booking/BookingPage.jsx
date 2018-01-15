import { Meteor } from 'meteor/meteor';
import React from 'react';
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

import SemanticGeoSuggest from '../../components/SemanticGeoSuggest/SemanticGeoSuggest';
import ModalLink from '../../components/ModalLink';
import Login from '../user/Login/Login';
import CartSummary from '../../components/CartSummary';
import { parseDateQueryString, formatDateDisplayString } from '../../../modules/format-date';

const BookingPage = props => (
  <div className="container">
    <div className="row margin-top-60 margin-bottom-60">
      {/* TODO: responsive  */}
      <div className="col-lg-8 col-md-8 padding-right-30">
        <form onSubmit={props.onSubmit}>
          <h3 className="margin-top-0 margin-bottom-30">Personal Details</h3>

          {!props.authenticated && (
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
                value={props.cart.firstName}
                onChange={props.onChange}
              />
            </div>

            <div className="col-md-6">
              <label>Last Name</label>
              <input
                name="lastName"
                type="text"
                value={props.cart.lastName}
                onChange={props.onChange}
              />
            </div>

            <div className="col-md-6">
              <label>Email</label>
              <input name="email" type="text" value={props.cart.email} onChange={props.onChange} />
            </div>

            <div className="col-md-6">
              <label>Phone</label>
              <input name="phone" type="text" value={props.cart.phone} onChange={props.onChange} />
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
                  props.onChange({ target: { name: 'address', value } });
                }}
                onSuggestSelect={(suggest) => {
                  // force onChange as well
                  props.onChange({ target: { name: 'address', value: suggest.label } });
                }}
              />
            </div>

            {!props.authenticated && (
              <div className="col-md-12">
                <Checkbox
                  className="margin-top-20"
                  defaultChecked
                  name="register"
                  onChange={(event, data) => {
                    props.onChange({ target: { name: 'register', value: data.checked } });
                  }}
                  label={<label>also sign me up with {Meteor.settings.public.appName}</label>}
                />
              </div>
            )}
          </div>

          <h3 className="margin-top-55 margin-bottom-30">Payment Method</h3>

          <div className="payment">
            {/* TODO: add saved credit card */}

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
                      <input name="nameOnCard" required type="text" />
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
                      props.onChange({ target: { name: 'saveCard', value: data.checked } });
                    }}
                    label={<label>save this card</label>}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="margin-top-20">
            <Button color="teal" circular size="large" disabled={props.cart.total === 0}>
              Confirm and Pay
            </Button>

            <Button color="teal" circular size="large" basic onClick={props.onBack}>
              Go back
            </Button>
          </div>
        </form>
      </div>

      {/* TODO: responsive  */}
      <div className="col-lg-4 col-md-4">
        <div className="boxed-widget opening-hours summary margin-top-0">
          <h3>
            <i className="fa fa-calendar-check-o" /> Booking Summary
          </h3>

          {!_.isNil(props.cart.stylist) && (
            <h3>
              {`${props.cart.stylist.name.first} ${props.cart.stylist.name.last}`}
              {props.cart.stylist.address &&
                props.cart.stylist.address.suburb &&
                ` (${props.cart.stylist.address.suburb}, ${props.cart.stylist.address.state})`}
            </h3>
          )}

          <ul>
            <li>
              Date{' '}
              <span>
                {parseDateQueryString(props.cart.date).isValid() &&
                  formatDateDisplayString(parseDateQueryString(props.cart.date))}
              </span>
            </li>
            <li>
              Time <span>{props.cart.time}</span>
            </li>
          </ul>

          <div className="booking margin-top-10">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  </div>
);

BookingPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

export default injectStripe(BookingPage);
