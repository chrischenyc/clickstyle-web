import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const DashboardPage = props => (
  <Container>
    {!_.isEmpty(props.firstName) && <Header as="h2">Hi, {props.firstName}!</Header>}

    {/* ---------- messages ---------- */}
    <div className="margin-bottom-30">
      <div className="notification success closeable">
        <Link to="daslfk">
          <p>
            Your listing <strong>Hotel Govendor</strong> has been approved!
          </p>
        </Link>
        <a className="close" href="#" />
      </div>

      <div className="notification warning closeable">
        <p>
          Your listing <strong>Hotel Govendor</strong> has been approved!
        </p>
        <a className="close" href="#" />
      </div>
    </div>

    {/* ---------- Recent Activities ---------- */}

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
  </Container>
);

DashboardPage.propTypes = {
  firstName: PropTypes.string.isRequired,
};

export default DashboardPage;
