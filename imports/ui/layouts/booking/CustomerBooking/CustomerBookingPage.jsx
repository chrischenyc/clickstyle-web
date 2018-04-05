import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Confirm, Button } from 'semantic-ui-react';
import classnames from 'classnames';

import { dateTimeString, parseBookingDateTime } from '../../../../modules/format-date';
import servicesSummary from '../../../../modules/format-services';
import formatPrice from '../../../../modules/format-price';
import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';
import BookingStatus from '../BookingStatus';

class CustomerBookingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCancelConfirm: false,
    };
  }

  render() {
    return (
      <Container>
        <Confirm
          open={this.state.showCancelConfirm}
          content={`To cancel this booking will cost you ${formatPrice(this.props.booking.cancellationFee)} ${
            this.props.booking.cancellationFeeReason
          }. Are you sure you want to cancel this booking?`}
          onCancel={() => {
            this.setState({ showCancelConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showCancelConfirm: false });
            this.props.onCancelBooking();
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
                  this.props.booking.stylist.photo || Meteor.settings.public.defaultAvatar,
                  'small',
                )}
                alt=""
              />
            </div>
            <div className="list-box-listing-content">
              <div className="inner">
                <h3>
                  <Link to={userProfileLink(this.props.booking.stylist)}>
                    {`${this.props.booking.stylist.name.first} ${
                      this.props.booking.stylist.name.last
                    }`}
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
                      {dateTimeString(parseBookingDateTime(this.props.booking.date + this.props.booking.time))}
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
                  <h5>Estimated Duration:</h5>
                  <ul className="booking-list">
                    <li className="highlighted">{`${this.props.booking.duration} mins`}</li>
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

                <BookingStatus booking={this.props.booking} />
              </div>
            </div>
          </div>
        </div>

        <Fragment>
          {(this.props.booking.status === 'confirmed' ||
            this.props.booking.status === 'pending') && (
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
        </Fragment>
      </Container>
    );
  }
}

CustomerBookingPage.propTypes = {
  booking: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onCancelBooking: PropTypes.func.isRequired,
};

export default CustomerBookingPage;
