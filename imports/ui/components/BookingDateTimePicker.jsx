import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import './SearchBar/react-day-picker-custom.css';

import {
  urlQueryDateString,
  parseUrlQueryDate,
  dateString,
  datePickerFormat,
} from '../../modules/format-date';
import { setUserInfo } from '../../modules/client/redux/cart';

import TimeInput from './TimeInput';

const BookingDateTimePicker = props => (
  <div className="row">
    <div className="col-lg-6 col-md-12">
      <DayPickerInput
        clickUnselectsDay
        inputProps={{
          readOnly: 'true',
        }}
        value={
          parseUrlQueryDate(props.cart.date).isValid()
            ? dateString(parseUrlQueryDate(props.cart.date))
            : ''
        }
        placeholder="Select date"
        onDayChange={(date) => {
          props.setUserInfo({ date: _.isNil(date) ? '' : urlQueryDateString(date) });
        }}
        format={datePickerFormat}
        formatDate={formatDate}
        parseDate={parseDate}
        dayPickerProps={{
          modifiers: {
            disabled: { before: new Date() },
            selected: day => urlQueryDateString(day) === props.cart.date,
          },
        }}
      />
    </div>

    <div className="col-lg-6 col-md-12">
      <TimeInput
        placeholder="Select time"
        optional
        value={props.cart.time}
        onChange={(time) => {
          props.setUserInfo({ time });
        }}
      />
    </div>
  </div>
);

BookingDateTimePicker.propTypes = {
  cart: PropTypes.object.isRequired,
  setUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { setUserInfo })(BookingDateTimePicker);
