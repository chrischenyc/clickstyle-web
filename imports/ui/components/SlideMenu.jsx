import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { push as Menu } from 'react-burger-menu';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Divider } from 'semantic-ui-react';

import { toggleSlideMenu } from '../../modules/client/redux/ui';
import './SlideMenu-style.css';

const SlideMenu = props => (
  <Menu
    customBurgerIcon={false}
    isOpen={props.open}
    width="75%"
    pageWrapId="page-wrap"
    outerContainerId="outer-container"
    onStateChange={({ isOpen }) => {
      props.toggleSlideMenu(isOpen);
    }}
  >
    <ul>
      <li>
        <Link
          to="/"
          onClick={() => {
            props.toggleSlideMenu();
          }}
        >
          Home
        </Link>
      </li>
      <Divider />

      <li>
        <Link
          to="/join"
          onClick={() => {
            props.toggleSlideMenu();
          }}
        >
          Become a stylist
        </Link>
      </li>

      <li>
        <Link
          to="/faq"
          onClick={() => {
            props.toggleSlideMenu();
          }}
        >
          FAQ
        </Link>
      </li>

      {!props.authenticated && (
        <Fragment>
          <li>
            <Link
              to="/signup"
              onClick={() => {
                props.toggleSlideMenu();
              }}
            >
              Sign up
            </Link>
          </li>

          <li>
            <Link
              to="/login"
              onClick={() => {
                props.toggleSlideMenu();
              }}
            >
              Log in
            </Link>
          </li>
        </Fragment>
      )}

      <Divider />

      {props.authenticated && (
        <Fragment>
          <li>
            <p>Accounts</p>
            <ul>
              <li>
                <Link
                  to="/users/dashboard"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  {`Dashboard ${props.notifications > 0 ? ` (${props.notifications})` : ''}`}
                </Link>
              </li>

              <li>
                <Link
                  to="/users/inbox"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  {`Inbox ${props.messages > 0 ? ` (${props.messages})` : ''}`}
                </Link>
              </li>
              <li>
                <Link
                  to="/users/profile"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </li>
          <Divider />

          <li>
            <p>Customer</p>
            <ul>
              <li>
                <Link
                  to="/users/bookings"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  {`My Bookings ${props.pendingBookings > 0 ? ` (${props.pendingBookings})` : ''}`}
                </Link>
              </li>
              <li>
                <Link
                  to="/users/booking/stylists"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Favourite stylists
                </Link>
              </li>
              <li>
                <Link
                  to="/users/payment-methods"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Payment methods
                </Link>
              </li>
            </ul>
          </li>
          <Divider />
        </Fragment>
      )}

      {props.isStylist && (
        <Fragment>
          <li>
            <p>Stylist</p>
            <ul>
              <li>
                <Link
                  to="/users/stylist/bookings"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  {`Customer Bookings ${
                    props.pendingCustomerBookings > 0 ? ` (${props.pendingCustomerBookings})` : ''
                  }`}
                </Link>
              </li>
              <li>
                <Link
                  to="/users/stylist/services"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/users/stylist/calendar"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Calendar
                </Link>
              </li>
              <li>
                <Link
                  to="/users/stylist/areas"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Areas
                </Link>
              </li>
              <li>
                <Link
                  to="/users/stylist/portfolio"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  to="/users/stylist/faq"
                  onClick={() => {
                    props.toggleSlideMenu();
                  }}
                >
                  Stylist FAQ
                </Link>
              </li>
            </ul>
          </li>
          <Divider />
        </Fragment>
      )}

      {props.authenticated && (
        <Fragment>
          <li>
            <Link
              to="/users/settings"
              onClick={() => {
                props.toggleSlideMenu();
              }}
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              to="/logout"
              onClick={(e) => {
                e.preventDefault();
                Meteor.logout();
                props.toggleSlideMenu();
              }}
            >
              Logout
            </Link>
          </li>
        </Fragment>
      )}
    </ul>
  </Menu>
);

SlideMenu.defaultProps = {
  isStylist: false,
  notifications: 0,
  messages: 0,
  pendingBookings: 0,
  pendingCustomerBookings: 0,
};

SlideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  isStylist: PropTypes.bool,
  notifications: PropTypes.number,
  messages: PropTypes.number,
  pendingBookings: PropTypes.number,
  pendingCustomerBookings: PropTypes.number,
  toggleSlideMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  open: state.ui.slideMenuOpen,
  authenticated: state.user.authenticated,
  isStylist: state.user.isStylist,
  notifications: state.user.notifications,
  messages: state.user.messages,
  pendingBookings: state.user.pendingBookings,
  pendingCustomerBookings: state.user.pendingCustomerBookings,
});

export default connect(mapStateToProps, { toggleSlideMenu })(SlideMenu);
