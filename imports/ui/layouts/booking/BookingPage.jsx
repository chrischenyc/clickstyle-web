import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal } from '../../../modules/client/redux/modal';
import Login from '../user/Login/Login';
import ModalLink from '../../components/ModalLink';
import CartSummary from '../../components/CartSummary';

const BookingPage = props => (
  <div className="container">
    <div className="row margin-top-60 margin-bottom-60">
      {/* TODO: responsive  */}
      <div className="col-lg-8 col-md-8 padding-right-30">
        <h3 className="margin-top-0 margin-bottom-30">
          Personal Details
          {!props.authenticated && (
            <span style={{ fontSize: '1rem', marginLeft: '2rem' }}>
              Already a user?&nbsp;
              <ModalLink
                className="sign-in"
                to="/login"
                component={
                  <Login
                    modal
                    onLoggedIn={() => {
                      props.closeModal();
                    }}
                  />
                }
                title="Log in to continue"
              >
                Log in
              </ModalLink>
              &nbsp;to continue
            </span>
          )}
        </h3>

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
            <input
              name="address"
              type="text"
              value={props.cart.address}
              onChange={props.onChange}
            />
          </div>
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
              <img className="payment-logo" src="https://i.imgur.com/IHEKLgm.png" alt="" />
            </div>

            <div className="payment-tab-content">
              <div className="row">
                <div className="col-md-6">
                  <div className="card-label">
                    <label htmlFor="nameOnCard">Name on Card</label>
                    <input id="nameOnCard" name="nameOnCard" required type="text" />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card-label">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234  5678  9876  5432"
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card-label">
                    <label htmlFor="expirynDate">Expiry Month</label>
                    <input id="expiryDate" placeholder="MM" required type="text" />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card-label">
                    <label htmlFor="expiryDate">Expiry Year</label>
                    <input id="expirynDate" placeholder="YY" required type="text" />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card-label">
                    <label htmlFor="cvv">CVV</label>
                    <input id="cvv" required type="text" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="margin-top-20">
          <Button
            color="teal"
            circular
            size="large"
            onClick={props.onConfirm}
            disabled={props.cart.total === 0}
          >
            Confirm and Pay
          </Button>

          <Button color="teal" circular size="large" basic onClick={props.onBack}>
            Go back
          </Button>
        </div>
      </div>

      {/* TODO: responsive  */}
      <div className="col-lg-4 col-md-4">
        <div className="boxed-widget opening-hours summary margin-top-0">
          <h3>
            <i className="fa fa-calendar-check-o" /> Booking Summary
          </h3>

          <h3>
            {`${props.cart.stylist.name.first} ${props.cart.stylist.name.last}`}
            {props.cart.stylist.address &&
              props.cart.stylist.address.suburb &&
              ` (${props.cart.stylist.address.suburb}, ${props.cart.stylist.address.state})`}
          </h3>

          <ul>
            <li>
              Date <span>10/20/2017</span>
            </li>
            <li>
              Time <span>5:30 PM</span>
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
  onConfirm: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default connect(null, { closeModal })(BookingPage);
