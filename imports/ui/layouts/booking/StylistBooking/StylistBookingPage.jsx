import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Button, Message, Confirm } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';
import BookingLogs from '../BookingLogs';
import BookingSummary from '../BookingSummary';

class StylistBookingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeclineConfirm: false,
      showCancelConfirm: false,
      showCompleteConfirm: false,
    };
  }

  render() {
    return (
      <Container>
        <Confirm
          open={this.state.showDeclineConfirm}
          content="Are you sure you want to decline this booking request?"
          onCancel={() => {
            this.setState({ showDeclineConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showDeclineConfirm: false });
            this.props.onDeclinePendingBooking();
          }}
        />

        <Confirm
          open={this.state.showCancelConfirm}
          content="This booking has been confirmed by you. Are you sure you want to cancel this booking?"
          onCancel={() => {
            this.setState({ showCancelConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showCancelConfirm: false });
            this.props.onCancelConfirmedBooking();
          }}
        />

        <Confirm
          open={this.state.showCompleteConfirm}
          content="You are supposed to complete the booking only after you have fulfilled the booked services. Customer will be charged once you complete this booking. Continue?"
          onCancel={() => {
            this.setState({ showCompleteConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showCompleteConfirm: false });
            this.props.onCompleteConfirmedBooking();
          }}
        />

        <div
          className={classnames({
            'pending-booking': this.props.booking.status === 'pending',
            'canceled-booking':
              this.props.booking.status === 'cancelled' || this.props.booking.status === 'declined',
            'approved-booking':
              this.props.booking.status === 'confirmed' ||
              this.props.booking.status === 'completed',
          })}
        >
          <div className="list-box-listing bookings">
            <div className="list-box-listing-img">
              <img
                src={scaledImageURL(
                  (this.props.booking.customer && this.props.booking.customer.photo) ||
                    Meteor.settings.public.defaultAvatar,
                  'small',
                )}
                alt=""
              />
            </div>
            <div className="list-box-listing-content">
              <div className="inner">
                <h3>
                  <Link to={userProfileLink(this.props.booking.customer)}>
                    {`${this.props.booking.firstName} ${this.props.booking.lastName}`}
                  </Link>{' '}
                  <span className="booking-status">{this.props.booking.status}</span>
                </h3>

                <BookingSummary booking={this.props.booking} />

                <BookingLogs booking={this.props.booking} />
              </div>
            </div>
          </div>

          {!_.isEmpty(this.props.error) && (
            <Message compact error>
              {this.props.error}
            </Message>
          )}
        </div>

        {this.props.booking.status === 'pending' && (
          <Fragment>
            <Button
              rounded
              color="teal"
              size="large"
              onClick={this.props.onAcceptPendingBooking}
              loading={this.props.loading}
            >
              Accept Booking
            </Button>
            <Button
              rounded
              negative
              size="large"
              onClick={() => {
                this.setState({ showDeclineConfirm: true });
              }}
              loading={this.props.loading}
            >
              Decline Booking
            </Button>
          </Fragment>
        )}

        <Fragment>
          {this.props.booking.status === 'confirmed' && (
            <Button
              rounded
              negative
              size="large"
              onClick={() => {
                this.setState({ showCancelConfirm: true });
              }}
              loading={this.props.loading}
            >
              Cancel Booking
            </Button>
          )}

          {this.props.booking.canBeCompleted && (
            <Button
              rounded
              color="teal"
              size="large"
              onClick={() => {
                this.setState({ showCompleteConfirm: true });
              }}
              loading={this.props.loading}
            >
              Complete Booking
            </Button>
          )}
        </Fragment>
      </Container>
    );
  }
}

StylistBookingPage.propTypes = {
  booking: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onAcceptPendingBooking: PropTypes.func.isRequired,
  onDeclinePendingBooking: PropTypes.func.isRequired,
  onCancelConfirmedBooking: PropTypes.func.isRequired,
  onCompleteConfirmedBooking: PropTypes.func.isRequired,
};

export default StylistBookingPage;
