import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';
import queryString from 'query-string';

import {
  toggleSideMenuCustomerBookings,
  toggleSideMenuMyBookings,
} from '../../modules/client/redux/ui';

class SideMenu extends Component {
  constructor(props) {
    super(props);

    if (
      props.sideMenuMyBookingsExpanded &&
      !props.location.pathname.startsWith('/users/bookings')
    ) {
      props.toggleSideMenuMyBookings(false);
    }

    if (
      props.sideMenuCustomerBookingsExpanded &&
      !props.location.pathname.startsWith('/users/stylist/bookings')
    ) {
      props.toggleSideMenuCustomerBookings(false);
    }
  }

  render() {
    const {
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
      sideMenuMyBookingsExpanded,
      sideMenuCustomerBookingsExpanded,
    } = this.props;

    return (
      <div className="dashboard-nav">
        <div className="dashboard-nav-inner">
          <ul>
            <li>
              <Link to="/" id="side-logo">
                <img src={`${Meteor.settings.public.CDN}logo.png`} alt="logo" />
              </Link>
            </li>
          </ul>

          <ul data-submenu-title="Account">
            <li className={classNames({ active: location.pathname === '/users/dashboard' })}>
              <Link to="/users/dashboard">
                <i className="im im-icon-Home" /> Dashboard
                {notifications > 0 && <span className="nav-tag messages">{notifications}</span>}
              </Link>
            </li>

            <li className={classNames({ active: location.pathname === '/users/inbox' })}>
              <Link to="/users/inbox">
                <i className="im im-icon-Email" /> Inbox
                {messages > 0 && <span className="nav-tag messages">{messages}</span>}
              </Link>
            </li>

            <li className={classNames({ active: location.pathname === '/users/profile' })}>
              <Link to="/users/profile">
                <i className="im im-icon-Profile" /> Profile
              </Link>
            </li>
          </ul>

          <ul data-submenu-title="Customer">
            <li
              className={classNames({
                active: sideMenuMyBookingsExpanded,
              })}
            >
              <Link
                to="/users/bookings"
                onClick={() => {
                  this.props.toggleSideMenuMyBookings();
                }}
              >
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
                <i className="im im-icon-Heart" /> Favourite stylists
              </Link>
            </li>

            <li className={classNames({ active: location.pathname === '/users/payment-methods' })}>
              <Link to="/users/payment-methods">
                <i className="im im-icon-Credit-Card" /> Payment methods
              </Link>
            </li>
          </ul>

          {isStylist && (
            <ul data-submenu-title="Stylist">
              <li
                className={classNames({
                  active: sideMenuCustomerBookingsExpanded,
                })}
              >
                <Link
                  to="/users/stylist/bookings"
                  onClick={() => {
                    this.props.toggleSideMenuCustomerBookings();
                  }}
                >
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

              <li
                className={classNames({ active: location.pathname === '/users/stylist/services' })}
              >
                <Link to="/users/stylist/services">
                  <i className="im im-icon-Pricing" /> Services
                </Link>
              </li>

              <li
                className={classNames({ active: location.pathname === '/users/stylist/calendar' })}
              >
                <Link to="/users/stylist/calendar">
                  <i className="im im-icon-Calendar-3" /> Calendar
                </Link>
              </li>

              <li className={classNames({ active: location.pathname === '/users/stylist/areas' })}>
                <Link to="/users/stylist/areas">
                  <i className="im im-icon-Location-2" /> Areas
                </Link>
              </li>

              <li
                className={classNames({ active: location.pathname === '/users/stylist/payment' })}
              >
                <Link to="/users/stylist/payment">
                  <i className="im im-icon-Money-2" /> Payment
                </Link>
              </li>

              <li
                className={classNames({ active: location.pathname === '/users/stylist/portfolio' })}
              >
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
            {!isStylist && (
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
  }
}

SideMenu.defaultProps = {
  isStylist: false,
  notifications: 0,
  messages: 0,
  confirmedBookings: 0,
  pendingBookings: 0,
  cancelledBookings: 0,
  declinedBookings: 0,
  completedBookings: 0,
  confirmedCustomerBookings: 0,
  pendingCustomerBookings: 0,
  cancelledCustomerBookings: 0,
  declinedCustomerBookings: 0,
  completedCustomerBookings: 0,
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
  sideMenuMyBookingsExpanded: PropTypes.bool.isRequired,
  sideMenuCustomerBookingsExpanded: PropTypes.bool.isRequired,
  toggleSideMenuCustomerBookings: PropTypes.func.isRequired,
  toggleSideMenuMyBookings: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isStylist: state.user.isStylist,
  notifications: state.user.profile.notifications,
  messages: state.user.profile.messages,
  confirmedBookings: state.user.profile.confirmedBookings,
  pendingBookings: state.user.profile.pendingBookings,
  cancelledBookings: state.user.profile.cancelledBookings,
  declinedBookings: state.user.profile.declinedBookings,
  completedBookings: state.user.profile.completedBookings,
  confirmedCustomerBookings: state.user.profile.confirmedCustomerBookings,
  pendingCustomerBookings: state.user.profile.pendingCustomerBookings,
  cancelledCustomerBookings: state.user.profile.cancelledCustomerBookings,
  declinedCustomerBookings: state.user.profile.declinedCustomerBookings,
  completedCustomerBookings: state.user.profile.completedCustomerBookings,
  sideMenuMyBookingsExpanded: state.ui.sideMenuMyBookingsExpanded,
  sideMenuCustomerBookingsExpanded: state.ui.sideMenuCustomerBookingsExpanded,
});

export default connect(
  mapStateToProps,
  { toggleSideMenuCustomerBookings, toggleSideMenuMyBookings },
)(withRouter(SideMenu));
