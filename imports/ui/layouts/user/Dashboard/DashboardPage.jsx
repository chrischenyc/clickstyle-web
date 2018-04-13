import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import classNames from 'classnames';

const DashboardPage = props => (
  <Container>
    {!_.isEmpty(props.firstName) && (
      <div className="col-md-12 margin-bottom-30">
        <Header as="h2">Hi, {props.firstName}!</Header>
      </div>
    )}

    {/* ---------- messages ---------- */}
    <div className="col-md-12">
      <div className="margin-bottom-30">
        {props.messages.map((message, index) => (
          <Link to={message.link} key={index}>
            <div className={classNames('notification closeable', message.type)}>
              <p>{message.content}</p>

              <a className="close" href="#" />
            </div>
          </Link>
        ))}
      </div>
    </div>

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
          {props.activities.map((activity, index) => (
            <Link to="asdlfkj" key={index}>
              <li>
                <i
                  className={classNames('list-box-icon', {
                    'sl sl-icon-clock': activity.type === 'booking',
                    'sl sl-icon-star': activity.type === 'review',
                  })}
                />
                {activity.content}
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
  messages: PropTypes.array.isRequired,
  activities: PropTypes.array.isRequired,
  upcomingBookings: PropTypes.array.isRequired,
};

export default DashboardPage;
