import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../components/HOC';
import BookingDetailPage from './BookingDetailPage';

class BookingDetail extends Component {
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
      this.props.history.push('/');
      return;
    }

    this.props.showLoading();

    Meteor.call('bookings.find', _id, (error, booking) => {
      this.props.hideLoading();

      if (booking) {
        this.setState({ booking });
      } else {
        this.props.history.push('/');
      }
    });
  }

  render() {
    if (!_.isNil(this.state.booking)) {
      return <BookingDetailPage booking={this.state.booking} />;
    }
    return '';
  }
}

BookingDetail.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(BookingDetail);
