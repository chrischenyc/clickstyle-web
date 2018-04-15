import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import { withLoading } from '../../../components/HOC';
import StylistBookingsPage from './StylistBookingsPage';

class StylistBookings extends Component {
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

    const { status } = queryString.parse(this.props.location.search);
    Meteor.call('bookings.stylist.list', status, (error, bookings) => {
      this.props.hideLoading();
      this.setState({ bookings });
    });
  }

  render() {
    return this.state.bookings ? <StylistBookingsPage bookings={this.state.bookings} /> : '';
  }
}

StylistBookings.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(StylistBookings);
