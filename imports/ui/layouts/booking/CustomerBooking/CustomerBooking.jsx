import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../../components/HOC';
import CustomerBookingPage from './CustomerBookingPage';

class CustomerBooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: null,
      loading: false,
      error: '',
    };

    this.handleCancelBooking = this.handleCancelBooking.bind(this);
  }

  componentDidMount() {
    this.loadBooking(this.props.match.params._id);
  }

  loadBooking(_id) {
    if (_.isNil(_id)) {
      this.props.history.push('/404');
      return;
    }

    this.props.showLoading();

    Meteor.call('customer.booking.find', _id, (error, booking) => {
      this.props.hideLoading();

      if (booking) {
        this.setState({ booking });
      } else {
        this.props.history.push('/404');
      }
    });
  }

  handleCancelBooking() {
    this.setState({ loading: true });

    const { _id } = this.props.match.params;

    Meteor.call('customer.booking.cancel', _id, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.error });
      } else {
        this.loadBooking(_id);
      }
    });
  }

  render() {
    if (!_.isNil(this.state.booking)) {
      return (
        <CustomerBookingPage
          booking={this.state.booking}
          onCancelBooking={this.handleCancelBooking}
          loading={this.state.loading}
          error={this.state.error}
        />
      );
    }
    return '';
  }
}

CustomerBooking.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(CustomerBooking);
