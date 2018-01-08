import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import CartSummary from '../../components/CartSummary';

const StylistBookingSection = props => (
  <div className="booking">
    <h3>
      <i className="fa fa-calendar-check-o " /> Make a booking
    </h3>

    <div className="row">
      <div className="col-lg-6 col-md-12">
        <input type="text" id="booking-date" />
      </div>

      <div className="col-lg-6 col-md-12">
        <input type="text" id="booking-time" />
      </div>
    </div>

    <div className="row">
      <CartSummary />
    </div>

    <Button
      circular
      size="huge"
      fluid
      color="teal"
      className="margin-top-25"
      disabled={props.cart.total === 0}
      onClick={props.onBook}
    >
      Book Now
    </Button>
  </div>
);

StylistBookingSection.propTypes = {
  cart: PropTypes.object.isRequired,
  onBook: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
});

export default connect(mapStateToProps)(StylistBookingSection);
