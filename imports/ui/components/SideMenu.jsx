import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

const SideMenu = ({ isStylist }) => (
  <div className="dashboard-nav">
    <div className="dashboard-nav-inner">
      <ul>
        <li>
          <Link to="/" id="side-logo">
            <img src="/images/logo.png" alt="logo" />
          </Link>
        </li>
      </ul>

      <ul data-submenu-title="Account">
        <li>
          <NavLink to="/users/dashboard">
            <i className="im im-icon-Home" /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/users/inbox">
            <i className="im im-icon-Email" /> Inbox
          </NavLink>
        </li>

        <li>
          <NavLink to="/users/profile">
            <i className="im im-icon-Profile" /> Profile
          </NavLink>
        </li>

        <li>
          <NavLink to="/users/settings">
            <i className="im im-icon-Gear" /> Settings
          </NavLink>
        </li>
      </ul>

      <ul data-submenu-title="Booking">
        <li>
          <NavLink to="/users/bookings">
            <i className="im im-icon-Calendar" /> Bookings
          </NavLink>
        </li>
        <li>
          <NavLink to="/users/booking/stylists">
            <i className="im im-icon-Heart" /> Favoured stylists
          </NavLink>
        </li>
      </ul>

      {isStylist && (
        <ul data-submenu-title="Stylist">
          <li>
            <NavLink to="/users/stylist/services">
              <i className="im im-icon-Pricing" /> Services
            </NavLink>
          </li>

          <li>
            <NavLink to="/users/stylist/calendar">
              <i className="im im-icon-Calendar-3" /> Calendar
            </NavLink>
          </li>

          <li>
            <NavLink to="/users/stylist/areas">
              <i className="im im-icon-Location-2" /> Areas
            </NavLink>
          </li>

          <li>
            <NavLink to="/users/stylist/portfolio">
              <i className="im im-icon-Camera-2" /> Portfolio
            </NavLink>
          </li>

          <li>
            <NavLink to="/users/stylist/bookings">
              <i className="im im-icon-Calendar" /> Customer Bookings
            </NavLink>
          </li>

          <li>
            <NavLink to="/users/stylist/faq">
              <i className="im im-icon-Information" /> FAQ
            </NavLink>
          </li>
        </ul>
      )}

      <ul data-submenu-title="">
        {isStylist && (
          <li>
            <NavLink to="/join">
              <i className="im im-icon-Business-ManWoman" /> Become a stylist
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/help">
            <i className="im im-icon-Information" /> Help
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/logout"
            onClick={(e) => {
              e.preventDefault();
              Meteor.logout();
            }}
          >
            <i className="im im-icon-Power-2" /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
);

SideMenu.defaultProps = {
  isStylist: false,
};

SideMenu.propTypes = {
  isStylist: PropTypes.bool,
};

const mapStateToProps = state => ({
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps)(SideMenu);
