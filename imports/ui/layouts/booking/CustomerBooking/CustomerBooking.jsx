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
      rating: 0,
      review: '',
    };

    this.handleCancelBooking = this.handleCancelBooking.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmitReview = this.handleSubmitReview.bind(this);
  }

  componentDidMount() {
    this.loadBooking();
  }

  loadBooking() {
    const { _id } = this.props.match.params;

    if (_.isNil(_id)) {
      this.props.history.push('/404');
      return;
    }

    this.props.showLoading();

    Meteor.call('bookings.customer.find', _id, (error, booking) => {
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

    Meteor.call('bookings.customer.cancel', this.state.booking._id, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.error });
      } else {
        this.setState({ error: '' });
        this.loadBooking();
      }
    });
  }

  handleOnChange(name, value) {
    this.setState({ [name]: value });
  }

  handleSubmitReview() {
    this.setState({ loading: true });

    const { _id } = this.state.booking;

    Meteor.call(
      'reviews.create',
      {
        _id,
        rating: this.state.rating,
        review: this.state.review,
      },
      (error) => {
        this.setState({ loading: false });

        if (error) {
          this.setState({ error: error.error });
        } else {
          this.setState({ error: '' });
          this.loadBooking();
        }
      },
    );
  }

  render() {
    if (!_.isNil(this.state.booking)) {
      return (
        <CustomerBookingPage
          booking={this.state.booking}
          onCancelBooking={this.handleCancelBooking}
          onChange={this.handleOnChange}
          loading={this.state.loading}
          error={this.state.error}
          rating={this.state.rating}
          review={this.state.review}
          onSubmitReview={this.handleSubmitReview}
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
