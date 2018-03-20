import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import classnames from 'classnames';

import { dateString, parseUrlQueryDate } from '../../../../modules/format-date';
import servicesSummary from '../../../../modules/format-services';
import formatPrice from '../../../../modules/format-price';
import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';

const CustomerBookingPage = props => (
  <Container>
    <div
      className={classnames({
        'pending-booking': props.booking.status === 'pending',
        'canceled-booking':
          props.booking.status === 'cancelled' || props.booking.status === 'declined',
        'approved-booking':
          props.booking.status === 'confirmed' || props.booking.status === 'completed',
      })}
    >
      <div className="list-box-listing bookings">
        <div className="list-box-listing-img">
          <img
            src={scaledImageURL(
              props.booking.stylist.photo || Meteor.settings.public.defaultAvatar,
              'small',
            )}
            alt=""
          />
        </div>
        <div className="list-box-listing-content">
          <div className="inner">
            <h3>
              <Link to={userProfileLink(props.booking.stylist)}>
                {`${props.booking.stylist.name.first} ${props.booking.stylist.name.last}`}
              </Link>{' '}
              <span className="booking-status">{props.booking.status}</span>
            </h3>

            <div className="inner-booking-list">
              <h5>Booking Number:</h5>
              <ul className="booking-list">
                <li className="highlighted">{props.booking._id}</li>
              </ul>
            </div>

            <div className="inner-booking-list">
              <h5>Booking Date:</h5>
              <ul className="booking-list">
                <li className="highlighted">
                  {`${dateString(parseUrlQueryDate(props.booking.date))} - ${props.booking.time}`}
                </li>
              </ul>
            </div>

            <div className="inner-booking-list">
              <h5>Booking Details:</h5>
              <ul className="booking-list">
                <li className="highlighted">{servicesSummary(props.booking.services)}</li>
              </ul>
            </div>

            <div className="inner-booking-list">
              <h5>Total:</h5>
              <ul className="booking-list">
                <li className="highlighted">{formatPrice(props.booking.total)}</li>
              </ul>
            </div>

            <div className="inner-booking-list">
              <h5>Customer name:</h5>
              <ul className="booking-list">
                <li className="highlighted">
                  {`${props.booking.firstName} ${props.booking.lastName}`}
                </li>
              </ul>
            </div>

            <div className="inner-booking-list">
              <h5>Customer mobile:</h5>
              <ul className="booking-list">
                <li className="highlighted">{props.booking.mobile}</li>
              </ul>
            </div>

            <div className="inner-booking-list">
              <h5>Customer address:</h5>
              <ul className="booking-list">
                <li className="highlighted">{props.booking.address}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Container>
);

CustomerBookingPage.propTypes = {
  booking: PropTypes.object.isRequired,
};

export default CustomerBookingPage;
