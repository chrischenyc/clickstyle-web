import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withLoading } from '../../../components/HOC';
import CustomerBookingsPage from './CustomerBookingsPage';

class CustomerBookings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: null,
    };
  }

  componentDidMount() {
    this.loadBookings();
  }

  loadBookings() {
    this.props.showLoading();

    Meteor.call('bookings.customer.find', (error, bookings) => {
      this.props.hideLoading();
      this.setState({ bookings });
    });
  }

  render() {
    return this.state.bookings ? <CustomerBookingsPage bookings={this.state.bookings} /> : '';
  }
}

CustomerBookings.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(CustomerBookings);
