import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import CartSummary from '../../components/CartSummary';

const BookingPage = props => (
  <div className="container">
    <div className="row margin-top-60 margin-bottom-60">
      {/* TODO: responsive  */}
      <div className="col-lg-8 col-md-8 padding-right-30">
        <h3 className="margin-top-0 margin-bottom-30">Personal Details</h3>

        <div className="row">
          <div className="col-md-6">
            <label>First Name</label>
            <input type="text" value="" />
          </div>

          <div className="col-md-6">
            <label>Last Name</label>
            <input type="text" value="" />
          </div>

          <div className="col-md-6">
            <div className="input-with-icon medium-icons">
              <label>E-Mail Address</label>
              <input type="text" value="" />
              <i className="im im-icon-Mail" />
            </div>
          </div>

          <div className="col-md-6">
            <div className="input-with-icon medium-icons">
              <label>Phone</label>
              <input type="text" value="" />
              <i className="im im-icon-Phone-2" />
            </div>
          </div>
        </div>

        <h3 className="margin-top-55 margin-bottom-30">Payment Method</h3>

        <div className="payment">
          <div className="payment-tab payment-tab-active">
            <div className="payment-tab-trigger">
              <input checked id="paypal" name="cardType" type="radio" value="paypal" />
              <label htmlFor="paypal">PayPal</label>
              <img className="payment-logo paypal" src="https://i.imgur.com/ApBxkXU.png" alt="" />
            </div>

            <div className="payment-tab-content">
              <p>You will be redirected to PayPal to complete payment.</p>
            </div>
          </div>

          <div className="payment-tab">
            <div className="payment-tab-trigger">
              <input type="radio" name="cardType" id="creditCart" value="creditCard" />
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

        <Button
          color="teal"
          circular
          size="large"
          className="margin-top-20"
          onClick={props.onConfirm}
        >
          Confirm and Pay
        </Button>
      </div>

      {/* TODO: responsive  */}
      <div className="col-lg-4 col-md-4">
        <div className="listing-item-container compact order-summary-widget">
          <div className="listing-item">
            <img src="images/listing-item-04.jpg" alt="" />

            <div className="listing-item-content">
              <div className="numerical-rating" data-rating="5.0" />
              <h3>Burger House</h3>
              <span>2726 Shinn Street, New York</span>
            </div>
          </div>
        </div>
        <div className="boxed-widget opening-hours summary margin-top-0">
          <h3>
            <i className="fa fa-calendar-check-o" /> Booking Summary
          </h3>
          <ul>
            <li>
              Date <span>10/20/2017</span>
            </li>
            <li>
              Hour <span>5:30 PM</span>
            </li>
          </ul>

          <div className="booking">
            <div className="row">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

BookingPage.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};

export default BookingPage;
