import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withLoading } from '../../components/HOC';
import CustomerBookingsPage from './CustomerBookingsPage';

class CustomerBookings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookings: [],
    };
  }

  componentDidMount() {
    this.loadBookings();
  }

  loadBookings() {
    this.props.showLoading();

    Meteor.call('customer.bookings.find', (error, bookings) => {
      this.props.hideLoading();
      this.setState({ bookings });
    });
  }

  render() {
    return <CustomerBookingsPage bookings={this.state.bookings} />;
  }
}

CustomerBookings.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(CustomerBookings);
