import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import classnames from 'classnames';

import scaledImageURL from '../../../../modules/scaled-image-url';
import { formatDateDisplayString, parseDateQueryString } from '../../../../modules/format-date';
import servicesSummary from '../../../../modules/format-services';
import formatPrice from '../../../../modules/format-price';

const CustomerBookingsPage = ({ bookings }) => (
  <Container>
    <div className="row">
      <div className="col-lg-12 col-md-12">
        <div className="dashboard-list-box margin-top-0">
          <h4>Bookings</h4>
          {bookings.length > 0 && (
            <ul>
              {bookings.map(booking => (
                <li
                  key={booking.owner}
                  className={classnames({
                    'pending-booking': booking.status === 'pending',
                    'canceled-booking':
                      booking.status === 'cancelled' || booking.status === 'declined',
                    'approved-booking':
                      booking.status === 'confirmed' || booking.status === 'completed',
                  })}
                >
                  <Link to={`/users/bookings/${booking._id}`}>
                    <div className="list-box-listing bookings">
                      <div className="list-box-listing-img">
                        <img
                          src={scaledImageURL(
                            (booking.stylist && booking.stylist.photo) ||
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

                          <div className="inner-booking-list">
                            <h5>Booking Date:</h5>
                            <ul className="booking-list">
                              <li className="highlighted">
                                {`${formatDateDisplayString(parseDateQueryString(booking.date))} - ${booking.time}`}
                              </li>
                            </ul>
                          </div>

                          <div className="inner-booking-list">
                            <h5>Booking Details:</h5>
                            <ul className="booking-list">
                              <li className="highlighted">{servicesSummary(booking.services)}</li>
                            </ul>
                          </div>

                          <div className="inner-booking-list">
                            <h5>Total:</h5>
                            <ul className="booking-list">
                              <li className="highlighted">{formatPrice(booking.total)}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {bookings.length === 0 && (
            <ul>
              <li>
                You haven&apos;t booked any stylist yet. <Link to="/search">Find a stylist</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  </Container>
);

CustomerBookingsPage.propTypes = {
  bookings: PropTypes.array.isRequired,
};

export default CustomerBookingsPage;
