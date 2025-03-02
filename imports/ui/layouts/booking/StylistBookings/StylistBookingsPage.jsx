import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import classnames from 'classnames';

import scaledImageURL from '../../../../modules/scaled-image-url';
import BookingsItemSummary from '../BookingsItemSummary';

const StylistBookingsPage = ({ bookings }) => (
  <Container>
    <div className="dashboard-list-box">
      <h4>Customer Bookings</h4>
      {bookings.length > 0 && (
        <ul>
          {bookings.map(booking => (
            <li
              key={booking._id}
              className={classnames({
                'pending-booking': booking.status === 'pending',
                'canceled-booking': booking.status === 'cancelled' || booking.status === 'declined',
                'approved-booking':
                  booking.status === 'confirmed' || booking.status === 'completed',
              })}
            >
              <Link to={`/users/stylist/bookings/${booking._id}`}>
                <div className="list-box-listing bookings">
                  <div className="list-box-listing-img">
                    <img
                      src={scaledImageURL(
                        (booking.customer && booking.customer.photo) ||
                          Meteor.settings.public.defaultAvatar,
                        'small',
                      )}
                      alt=""
                    />
                  </div>
                  <div className="list-box-listing-content">
                    <div className="inner">
                      <h3>
                        {`${booking.firstName} ${booking.lastName}`}{' '}
                        <span className="booking-status">{booking.status}</span>
                      </h3>

                      <BookingsItemSummary booking={booking} />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  </Container>
);

StylistBookingsPage.propTypes = {
  bookings: PropTypes.array.isRequired,
};

export default StylistBookingsPage;
