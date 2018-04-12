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

    {/* ---------- Recent Activities ---------- */}

    <div className="col-lg-6 col-md-12">
      <div className="dashboard-list-box with-icons margin-top-20">
        <h4>Recent Activities</h4>
        <ul>
          <li>
            <i className="list-box-icon sl sl-icon-layers" /> Your listing{' '}
            <strong>
              <a href="#">Hotel Govendor</a>
            </strong>{' '}
            has been approved!
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> Kathy Brown left a review{' '}
            <div className="numerical-rating" data-rating="5.0" /> on{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-heart" /> Someone bookmarked your{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>{' '}
            listing!
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> Kathy Brown left a review{' '}
            <div className="numerical-rating" data-rating="3.0" /> on{' '}
            <strong>
              <a href="#">Airport</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-heart" /> Someone bookmarked your{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>{' '}
            listing!
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> John Doe left a review{' '}
            <div className="numerical-rating" data-rating="4.0" /> on{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> Jack Perry left a review{' '}
            <div className="numerical-rating" data-rating="2.5" /> on{' '}
            <strong>
              <a href="#">Tom's Restaurant</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* ---------- Upcoming bookings ---------- */}

    <div className="col-lg-6 col-md-12">
      <div className="dashboard-list-box with-icons margin-top-20">
        <h4>Upcoming bookings</h4>
        <ul>
          <li>
            <i className="list-box-icon sl sl-icon-layers" /> Your listing{' '}
            <strong>
              <a href="#">Hotel Govendor</a>
            </strong>{' '}
            has been approved!
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> Kathy Brown left a review{' '}
            <div className="numerical-rating" data-rating="5.0" /> on{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-heart" /> Someone bookmarked your{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>{' '}
            listing!
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> Kathy Brown left a review{' '}
            <div className="numerical-rating" data-rating="3.0" /> on{' '}
            <strong>
              <a href="#">Airport</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-heart" /> Someone bookmarked your{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>{' '}
            listing!
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> John Doe left a review{' '}
            <div className="numerical-rating" data-rating="4.0" /> on{' '}
            <strong>
              <a href="#">Burger House</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>

          <li>
            <i className="list-box-icon sl sl-icon-star" /> Jack Perry left a review{' '}
            <div className="numerical-rating" data-rating="2.5" /> on{' '}
            <strong>
              <a href="#">Tom's Restaurant</a>
            </strong>
            <a href="#" className="close-list-item">
              <i className="fa fa-close" />
            </a>
          </li>
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
