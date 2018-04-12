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
          <div key={index} className={classNames('notification closeable', message.type)}>
            <Link to={message.link}>
              <p>{message.content}</p>
            </Link>
            <a className="close" href="#" />
          </div>
        ))}
      </div>
    </div>

    {/* ---------- Upcoming bookings ---------- */}

    <div className="col-lg-6 col-md-12">
      <div className="dashboard-list-box with-icons margin-top-20">
        <h4>Upcoming bookings</h4>
        <ul>
          {props.bookings.map((booking, index) => (
            <li key={index}>
              <i className="list-box-icon sl sl-icon-clock" />
              <Link to="asdlfkj">{booking.content}</Link>
            </li>
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
            <li key={index}>
              <i
                className={classNames('list-box-icon', {
                  'sl sl-icon-clock': activity.type === 'booking',
                  'sl sl-icon-star': activity.type === 'review',
                })}
              />
              <Link to="asdlfkj">{activity.content}</Link>
              <a href="#" className="close-list-item">
                <i className="fa fa-close" />
              </a>
            </li>
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
  bookings: PropTypes.array.isRequired,
};

export default DashboardPage;
