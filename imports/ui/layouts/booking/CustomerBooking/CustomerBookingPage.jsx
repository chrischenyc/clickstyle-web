import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Container,
  Confirm,
  Button,
  TextArea,
  Rating,
  Header,
  Message,
  Icon,
} from 'semantic-ui-react';
import classnames from 'classnames';
import _ from 'lodash';

import formatPrice from '../../../../modules/format-price';
import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';
import BookingSummary from '../BookingSummary';
import BookingLogs from '../BookingLogs';
import BookingReview from '../BookingReview';

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
              <Link target="_blank" to={userProfileLink(this.props.booking.stylist)}>
                <img
                  src={scaledImageURL(
                    this.props.booking.stylist.photo || Meteor.settings.public.defaultAvatar,
                    'small',
                  )}
                  alt=""
                />
              </Link>
            </div>
            <div className="list-box-listing-content">
              <div className="inner">
                <h3>
                  <Link target="_blank" to={userProfileLink(this.props.booking.stylist)}>
                    {`${this.props.booking.stylist.name.first} ${
                      this.props.booking.stylist.name.last
                    }`}
                  </Link>
                  <span className="booking-status">{this.props.booking.status}</span>
                </h3>

                <Link to={`/chats/${this.props.booking._id}`}>
                  <Button
                    color="teal"
                    circular
                    icon
                    labelPosition="left"
                    style={{ marginBottom: '1em' }}
                  >
                    <Icon name="mail outline" />
                    Message {this.props.booking.stylist.name.first}
                  </Button>
                </Link>

                <BookingSummary booking={this.props.booking} />

                <BookingLogs booking={this.props.booking} />
              </div>
            </div>
          </div>

          {!_.isEmpty(this.props.error) && (
            <Message compact error className="margin-bottom-20">
              {this.props.error}
            </Message>
          )}
        </div>

        <Fragment>
          {(this.props.booking.status === 'confirmed' ||
            this.props.booking.status === 'pending') && (
            <Button
              circular
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

        {this.props.booking.status === 'completed' &&
          !this.props.booking.review && (
            <Fragment>
              <Header as="h3">Review your experience</Header>
              <div style={{ marginBottom: '1em' }}>
                <p>Your rating for this stylist</p>
                <Rating
                  icon="star"
                  defaultRating={this.props.rating}
                  maxRating={5}
                  onRate={(event, data) => {
                    this.props.onChange('rating', data.rating);
                  }}
                />
              </div>
              <div style={{ marginBottom: '1em' }}>
                <p>Write a review:</p>
                <TextArea
                  style={{ maxWidth: '10rem' }}
                  value={this.props.review}
                  onChange={(event, data) => {
                    this.props.onChange('review', data.value);
                  }}
                />
              </div>
              <Button
                circular
                color="teal"
                size="large"
                loading={this.props.loading}
                disabled={this.props.rating === 0 || _.isEmpty(this.props.review)}
                onClick={() => {
                  this.props.onSubmitReview();
                }}
              >
                Submit Review
              </Button>
            </Fragment>
          )}

        {this.props.booking.review && <BookingReview review={this.props.booking.review} />}
      </Container>
    );
  }
}

CustomerBookingPage.propTypes = {
  booking: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onCancelBooking: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  onSubmitReview: PropTypes.func.isRequired,
};

export default CustomerBookingPage;
