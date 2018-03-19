import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../../components/HOC';
import BookingRequestedPage from './BookingRequestedPage';

class BookingRequested extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: null,
    };
  }

  componentDidMount() {
    this.loadBooking(this.props.match.params._id, this.props.match.params.userId);
  }

  loadBooking(_id, userId) {
    if (_.isNil(_id)) {
      this.props.history.push('/404');
      return;
    }

    this.props.showLoading();

    Meteor.call('requested.booking.find', { _id, userId }, (error, booking) => {
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
      return <BookingRequestedPage booking={this.state.booking} />;
    }
    return '';
  }
}

BookingRequested.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(BookingRequested);
