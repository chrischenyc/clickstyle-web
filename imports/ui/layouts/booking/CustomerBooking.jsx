import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../components/HOC';
import CustomerBookingPage from './CustomerBookingPage';

class CustomerBooking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: null,
    };
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

  render() {
    if (!_.isNil(this.state.booking)) {
      return <CustomerBookingPage booking={this.state.booking} />;
    }
    return '';
  }
}

CustomerBooking.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(CustomerBooking);
