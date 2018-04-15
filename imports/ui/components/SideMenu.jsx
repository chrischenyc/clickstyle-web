import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import queryString from 'query-string';

const SideMenu = ({
  isStylist,
  location,
  notifications,
  messages,
  confirmedBookings,
  pendingBookings,
  cancelledBookings,
  declinedBookings,
  completedBookings,
  confirmedCustomerBookings,
  pendingCustomerBookings,
  cancelledCustomerBookings,
  declinedCustomerBookings,
  completedCustomerBookings,
}) => (
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
        <li className={classNames({ active: location.pathname === '/users/dashboard' })}>
          <Link to="/users/dashboard">
            <i className="im im-icon-Home" /> Dashboard
          </Link>
        </li>

        <li className={classNames({ active: location.pathname === '/users/inbox' })}>
          <Link to="/users/inbox">
            <i className="im im-icon-Email" /> Inbox
          </Link>
        </li>

        <li className={classNames({ active: location.pathname === '/users/profile' })}>
          <Link to="/users/profile">
            <i className="im im-icon-Profile" /> Profile
          </Link>
        </li>

        <li className={classNames({ active: location.pathname === '/users/payment-methods' })}>
          <Link to="/users/payment-methods">
            <i className="im im-icon-Credit-Card" /> Payment methods
          </Link>
        </li>
      </ul>

      <ul data-submenu-title="Customer">
        <li className={classNames({ active: location.pathname === '/users/bookings' })}>
          <Link to="/users/bookings">
            <i className="im im-icon-Calendar" /> My Bookings
          </Link>
          <ul>
            {confirmedBookings > 0 && (
              <li
                className={classNames({
                  active:
                    location.pathname === '/users/bookings' &&
                    queryString.parse(location.search).status === 'confirmed',
                })}
              >
                <Link to="/users/bookings?status=confirmed">
                  Confirmed <span className="nav-tag green">{confirmedBookings}</span>
                </Link>
              </li>
            )}
            {pendingBookings > 0 && (
              <li
                className={classNames({
                  active:
                    location.pathname === '/users/bookings' &&
                    queryString.parse(location.search).status === 'pending',
                })}
              >
                <Link to="/users/bookings?status=pending">
                  Pending <span className="nav-tag lightblue">{pendingBookings}</span>
                </Link>
              </li>
            )}
            {declinedBookings > 0 && (
              <li
                className={classNames({
                  active:
                    location.pathname === '/users/bookings' &&
                    queryString.parse(location.search).status === 'declined',
                })}
              >
                <Link to="/users/bookings?status=declined">
                  Declined <span className="nav-tag red">{declinedBookings}</span>
                </Link>
              </li>
            )}
            {cancelledBookings > 0 && (
              <li
                className={classNames({
                  active:
                    location.pathname === '/users/bookings' &&
                    queryString.parse(location.search).status === 'cancelled',
                })}
              >
                <Link to="/users/bookings?status=cancelled">
                  Cancelled <span className="nav-tag red">{cancelledBookings}</span>
                </Link>
              </li>
            )}
            {completedBookings > 0 && (
              <li
                className={classNames({
                  active:
                    location.pathname === '/users/bookings' &&
                    queryString.parse(location.search).status === 'completed',
                })}
              >
                <Link to="/users/bookings?status=completed">
                  Completed <span className="nav-tag green">{completedBookings}</span>
                </Link>
              </li>
            )}
          </ul>
        </li>
        <li className={classNames({ active: location.pathname === '/users/booking/stylists' })}>
          <Link to="/users/booking/stylists">
            <i className="im im-icon-Heart" /> Favoured stylists
          </Link>
        </li>
      </ul>

      {isStylist && (
        <ul data-submenu-title="Stylist">
          <li className={classNames({ active: location.pathname === '/users/stylist/bookings' })}>
            <Link to="/users/stylist/bookings">
              <i className="im im-icon-Calendar" /> Customer Bookings
            </Link>

            <ul>
              {confirmedCustomerBookings > 0 && (
                <li
                  className={classNames({
                    active:
                      location.pathname === '/users/stylist/bookings' &&
                      queryString.parse(location.search).status === 'confirmed',
                  })}
                >
                  <Link to="/users/stylist/bookings?status=confirmed">
                    Confirmed <span className="nav-tag green">{confirmedCustomerBookings}</span>
                  </Link>
                </li>
              )}
              {pendingCustomerBookings > 0 && (
                <li
                  className={classNames({
                    active:
                      location.pathname === '/users/stylist/bookings' &&
                      queryString.parse(location.search).status === 'pending',
                  })}
                >
                  <Link to="/users/stylist/bookings?status=pending">
                    Pending <span className="nav-tag lightblue">{pendingCustomerBookings}</span>
                  </Link>
                </li>
              )}
              {declinedCustomerBookings > 0 && (
                <li
                  className={classNames({
                    active:
                      location.pathname === '/users/stylist/bookings' &&
                      queryString.parse(location.search).status === 'declined',
                  })}
                >
                  <Link to="/users/stylist/bookings?status=declined">
                    Declined <span className="nav-tag red">{declinedCustomerBookings}</span>
                  </Link>
                </li>
              )}
              {cancelledCustomerBookings > 0 && (
                <li
                  className={classNames({
                    active:
                      location.pathname === '/users/stylist/bookings' &&
                      queryString.parse(location.search).status === 'cancelled',
                  })}
                >
                  <Link to="/users/stylist/bookings?status=cancelled">
                    Cancelled <span className="nav-tag red">{cancelledCustomerBookings}</span>
                  </Link>
                </li>
              )}
              {completedCustomerBookings > 0 && (
                <li
                  className={classNames({
                    active:
                      location.pathname === '/users/stylist/bookings' &&
                      queryString.parse(location.search).status === 'completed',
                  })}
                >
                  <Link to="/users/stylist/bookings?status=completed">
                    Completed <span className="nav-tag green">{completedCustomerBookings}</span>
                  </Link>
                </li>
              )}
            </ul>
          </li>

          <li className={classNames({ active: location.pathname === '/users/stylist/services' })}>
            <Link to="/users/stylist/services">
              <i className="im im-icon-Pricing" /> Services
            </Link>
          </li>

          <li className={classNames({ active: location.pathname === '/users/stylist/calendar' })}>
            <Link to="/users/stylist/calendar">
              <i className="im im-icon-Calendar-3" /> Calendar
            </Link>
          </li>

          <li className={classNames({ active: location.pathname === '/users/stylist/areas' })}>
            <Link to="/users/stylist/areas">
              <i className="im im-icon-Location-2" /> Areas
            </Link>
          </li>

          <li className={classNames({ active: location.pathname === '/users/stylist/portfolio' })}>
            <Link to="/users/stylist/portfolio">
              <i className="im im-icon-Camera-2" /> Portfolio
            </Link>
          </li>

          <li className={classNames({ active: location.pathname === '/users/stylist/faq' })}>
            <Link to="/users/stylist/faq">
              <i className="im im-icon-Information" /> Stylist FAQ
            </Link>
          </li>
        </ul>
      )}

      <ul data-submenu-title="">
        {isStylist && (
          <li>
            <Link to="/join">
              <i className="im im-icon-Business-ManWoman" /> Become a stylist
            </Link>
          </li>
        )}
        <li>
          <Link to="/faq">
            <i className="im im-icon-Information" /> FAQ
          </Link>
        </li>

        <li className={classNames({ active: location.pathname === '/users/settings' })}>
          <Link to="/users/settings">
            <i className="im im-icon-Gear" /> Settings
          </Link>
        </li>

        <li>
          <Link
            to="/logout"
            onClick={(e) => {
              e.preventDefault();
              Meteor.logout();
            }}
          >
            <i className="im im-icon-Power-2" /> Logout
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

SideMenu.defaultProps = {
  isStylist: false,
  notifications: null,
  messages: null,
  confirmedBookings: null,
  pendingBookings: null,
  cancelledBookings: null,
  declinedBookings: null,
  completedBookings: null,
  confirmedCustomerBookings: null,
  pendingCustomerBookings: null,
  cancelledCustomerBookings: null,
  declinedCustomerBookings: null,
  completedCustomerBookings: null,
};

SideMenu.propTypes = {
  isStylist: PropTypes.bool,
  notifications: PropTypes.number,
  messages: PropTypes.number,
  confirmedBookings: PropTypes.number,
  pendingBookings: PropTypes.number,
  cancelledBookings: PropTypes.number,
  declinedBookings: PropTypes.number,
  completedBookings: PropTypes.number,
  confirmedCustomerBookings: PropTypes.number,
  pendingCustomerBookings: PropTypes.number,
  cancelledCustomerBookings: PropTypes.number,
  declinedCustomerBookings: PropTypes.number,
  completedCustomerBookings: PropTypes.number,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  isStylist: state.user.isStylist,
  notifications: state.user.notifications,
  messages: state.user.messages,
  confirmedBookings: state.user.confirmedBookings,
  pendingBookings: state.user.pendingBookings,
  cancelledBookings: state.user.cancelledBookings,
  declinedBookings: state.user.declinedBookings,
  completedBookings: state.user.completedBookings,
  confirmedCustomerBookings: state.user.confirmedCustomerBookings,
  pendingCustomerBookings: state.user.pendingCustomerBookings,
  cancelledCustomerBookings: state.user.cancelledCustomerBookings,
  declinedCustomerBookings: state.user.declinedCustomerBookings,
  completedCustomerBookings: state.user.completedCustomerBookings,
});

export default connect(mapStateToProps)(withRouter(SideMenu));
