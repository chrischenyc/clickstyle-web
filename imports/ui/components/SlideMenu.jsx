import { Meteor } from 'meteor/meteor';
import React from 'react';
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

      {!props.authenticated && (
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
      )}

      {!props.authenticated && (
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
      )}
      <Divider />

      {props.authenticated && (
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
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/users/inbox"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Inbox
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
          </ul>
        </li>
      )}
      {props.authenticated && <Divider />}

      {props.authenticated && (
        <li>
          <p>Booking</p>
          <ul>
            <li>
              <Link
                to="/users/bookings"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/users/booking/stylists"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Favoured stylists
              </Link>
            </li>
          </ul>
        </li>
      )}
      {props.authenticated && <Divider />}

      {props.isStylist && (
        <li>
          <p>Stylist</p>
          <ul>
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
                FAQ
              </Link>
            </li>
          </ul>
        </li>
      )}
      {props.isStylist && <Divider />}

      <li>
        <Link
          to="/help"
          onClick={() => {
            props.toggleSlideMenu();
          }}
        >
          Help
        </Link>
      </li>

      <li>
        {props.authenticated && (
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
        )}
      </li>
    </ul>
  </Menu>
);

SlideMenu.defaultProps = {
  isStylist: false,
};

SlideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  isStylist: PropTypes.bool,
  toggleSlideMenu: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  open: state.ui.slideMenuOpen,
  authenticated: state.user.authenticated,
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps, { toggleSlideMenu })(SlideMenu);
