import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Button, Message, Confirm } from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import { dateString, parseUrlQueryDate } from '../../../../modules/format-date';
import servicesSummary from '../../../../modules/format-services';
import formatPrice from '../../../../modules/format-price';
import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';

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
          content="You are supposed to complete the booking only after you have fulfilled the booked service(s). Continue?"
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

                <div className="inner-booking-list">
                  <h5>Booking Number:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">{this.props.booking._id}</li>
                  </ul>
                </div>

                <div className="inner-booking-list">
                  <h5>Booking Date:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">
                      {`${dateString(parseUrlQueryDate(this.props.booking.date))} - ${
                        this.props.booking.time
                      }`}
                    </li>
                  </ul>
                </div>

                <div className="inner-booking-list">
                  <h5>Booking Details:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">{servicesSummary(this.props.booking.services)}</li>
                  </ul>
                </div>

                <div className="inner-booking-list">
                  <h5>Total:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">{formatPrice(this.props.booking.total)}</li>
                  </ul>
                </div>

                <div className="inner-booking-list">
                  <h5>Customer name:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">
                      {`${this.props.booking.firstName} ${this.props.booking.lastName}`}
                    </li>
                  </ul>
                </div>

                <div className="inner-booking-list">
                  <h5>Customer mobile:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">{this.props.booking.mobile}</li>
                  </ul>
                </div>

                <div className="inner-booking-list">
                  <h5>Customer address:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">{this.props.booking.address}</li>
                  </ul>
                </div>
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
          <div>
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
          </div>
        )}

        <div>
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

          {this.props.booking.status === 'confirmed' && (
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
        </div>
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
