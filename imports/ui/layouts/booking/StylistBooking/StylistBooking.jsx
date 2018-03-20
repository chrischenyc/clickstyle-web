import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../../components/HOC';
import StylistBookingPage from './StylistBookingPage';

class StylistBooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: null,
      loading: false,
      error: '',
    };

    this.handleAcceptPendingBooking = this.handleAcceptPendingBooking.bind(this);
    this.handleDeclinePendingBooking = this.handleDeclinePendingBooking.bind(this);
    this.handleCancelConfirmedBooking = this.handleCancelConfirmedBooking.bind(this);
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

    Meteor.call('stylist.booking.find', _id, (error, booking) => {
      this.props.hideLoading();

      if (booking) {
        this.setState({ booking });
      } else {
        this.props.history.push('/404');
      }
    });
  }

  handleAcceptPendingBooking() {
    this.setState({ loading: true });

    const { _id } = this.props.match.params;

    Meteor.call('stylist.booking.pending.confirm', _id, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.error });
      } else {
        this.loadBooking(_id);
      }
    });
  }

  handleDeclinePendingBooking() {
    this.setState({ loading: true });
  }

  handleCancelConfirmedBooking() {
    this.setState({ loading: true });
  }

  render() {
    if (!_.isNil(this.state.booking)) {
      return (
        <StylistBookingPage
          booking={this.state.booking}
          onAcceptPendingBooking={this.handleAcceptPendingBooking}
          onDeclinePendingBooking={this.handleDeclinePendingBooking}
          onCancelConfirmedBooking={this.handleCancelConfirmedBooking}
          loading={this.state.loading}
          error={this.state.error}
        />
      );
    }
    return '';
  }
}

StylistBooking.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(StylistBooking);
