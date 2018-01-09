import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import '../../components/SearchBar/react-day-picker-custom.css';

import TimeInput from '../../components/TimeInput';
import {
  formatDateQueryString,
  parseDateQueryString,
  formatDateDisplayString,
  datePickerFormat,
} from '../../../modules/format-date';

import CartSummary from '../../components/CartSummary';

const StylistBookingSection = props => (
  <div className="booking">
    <h3>
      <i className="fa fa-calendar-check-o " /> Make a booking
    </h3>

    <div className="row">
      <div className="col-lg-6 col-md-12">
        <DayPickerInput
          // value={
          //   parseDateQueryString(this.state.date).isValid()
          //     ? formatDateDisplayString(parseDateQueryString(this.state.date))
          //     : ''
          // }
          placeholder="Date"
          onDayChange={(date) => {
            // this.setState({ date: formatDateQueryString(date) });
          }}
          format={datePickerFormat}
          formatDate={formatDate}
          parseDate={parseDate}
          dayPickerProps={{
            modifiers: {
              disabled: { before: new Date() },
              // selected: day => formatDateQueryString(day) === this.state.date,
            },
          }}
        />
      </div>

      <div className="col-lg-6 col-md-12">
        <TimeInput
          placeholder="Time"
          optional
          // value={this.state.time}
          onChange={(time) => {
            // this.setState({ time });
          }}
        />
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
