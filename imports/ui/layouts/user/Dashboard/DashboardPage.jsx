import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';
import moment from 'moment';

const DashboardPage = props => (
  <Container>
    {!_.isEmpty(props.firstName) && (
      <div className="col-md-12 margin-bottom-30">
        <Header as="h2">Hi, {props.firstName}!</Header>
      </div>
    )}

    {/* ---------- messages ---------- */}
    {props.notifications.length > 0 && (
      <div className="col-md-12">
        <div className="margin-bottom-30">
          {props.notifications.map(notification => (
            <Link to={notification.link} key={notification._id}>
              <div
                className={classNames('notification', {
                  closeable: notification.dismissible,
                  success: notification.type !== 'warning' && notification.type !== 'error',
                  warning: notification.type === 'warning',
                  error: notification.type === 'error',
                })}
              >
                <p>{notification.content}</p>

                {notification.dismissible && <a className="close" href="#" />}
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}

    {/* ---------- Upcoming bookings ---------- */}

    <div className="col-lg-6 col-md-12">
      <div className="dashboard-list-box with-icons margin-top-20">
        <h4>Upcoming Bookings</h4>
        <ul>
          {props.upcomingBookings.map(booking => (
            <Link to={booking.link} key={booking._id}>
              <li>
                <i className="list-box-icon sl sl-icon-clock" />
                {booking.content}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>

    {/* ---------- Recent Activities ---------- */}

    <div className="col-lg-6 col-md-12">
      <div className="dashboard-list-box with-icons margin-top-20">
        <h4>Recent Activities</h4>
        <ul>
          {props.recentActivities.map(activity => (
            <Link to={activity.link} key={activity._id}>
              <li>
                <i
                  className={classNames('list-box-icon', {
                    'sl sl-icon-question': activity.action === 'requested',
                    'sl sl-icon-check': activity.action === 'confirmed',
                    'sl sl-icon-close':
                      activity.action === 'declined' || activity.action === 'cancelled',
                    'sl sl-icon-star': activity.action === 'reviewed',
                    'sl sl-icon-trophy': activity.action === 'completed',
                  })}
                />
                {activity.content} <span>{moment(activity.createdAt).fromNow()}</span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  </Container>
);

DashboardPage.propTypes = {
  firstName: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  notifications: PropTypes.array.isRequired,
  recentActivities: PropTypes.array.isRequired,
  upcomingBookings: PropTypes.array.isRequired,
};

export default DashboardPage;
