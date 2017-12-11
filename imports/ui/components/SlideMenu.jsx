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
          Accounts
          <ul>
            <li>
              <Link
                to="/dashboard"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/inbox"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Inbox
              </Link>
            </li>
            <li>
              <Link
                to="/profiles/edit"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/settings"
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

      {props.isStylist && (
        <li>
          Stylist
          <ul>
            <li>
              <Link
                to="/stylists/me/services"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Service & Price List
              </Link>
            </li>
            <li>
              <Link
                to="/stylists/me/available-time"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/stylists/me/available-areas"
                onClick={() => {
                  props.toggleSlideMenu();
                }}
              >
                Areas
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
  open: state.ui.openSlideMenu,
  authenticated: state.user.authenticated,
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps, { toggleSlideMenu })(SlideMenu);
