import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container, Confirm, Button } from 'semantic-ui-react';
import classnames from 'classnames';

import formatPrice from '../../../../modules/format-price';
import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';
import BookingSummary from '../BookingSummary';
import BookingLogs from '../BookingLogs';

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
          content={`Cancelling this booking will cost you ${formatPrice(this.props.booking.cancellationFee)} (${
            this.props.booking.cancellationFeeReason
          }). Are you sure you want to cancel this booking?`}
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

                <BookingSummary booking={this.props.booking} />

                <BookingLogs booking={this.props.booking} />
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
