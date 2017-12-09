import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { closeModal } from '../../modules/client/redux/modal';
import { toggleSlideMenu } from '../../modules/client/redux/ui';
import ModalLink from '../components/ModalLink';
import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';
import ScaledImageURL from '../../modules/scaled-image-url';

/**
 * Header has a desktop/tablet version and a mobile phone version
 */
const Header = (props) => {
  const { authenticated, firstName, photo } = props;

  return (
    <header id="header-container">
      <div id="header">
        <div className="container">
          <div className="left-side">
            <div id="logo">
              <Link to="/">
                <img src="images/logo.png" alt="logo" />
              </Link>
            </div>

            <div className="mmenu-trigger">
              <button
                className="hamburger hamburger--collapse"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  props.toggleSlideMenu();
                }}
              >
                <span className="hamburger-box">
                  <span className="hamburger-inner" />
                </span>
              </button>
            </div>

            <nav id="navigation" className="style-1">
              <ul id="responsive">
                <li>
                  <Link to="/join">Become a stylist</Link>
                </li>

                <li>
                  <Link to="/help">Help</Link>
                </li>
              </ul>
            </nav>

            <div className="clearfix" />
          </div>

          <div className="right-side">
            <nav id="navigation" className="style-1">
              <ul id="responsive">
                {!authenticated && (
                  <li>
                    <ModalLink
                      className="sign-in"
                      to="/signup"
                      component={
                        <SignUp
                          modal
                          onLoggedIn={() => {
                            props.closeModal();
                          }}
                        />
                      }
                      title="Join us"
                    >
                      Sign Up
                    </ModalLink>
                  </li>
                )}

                {!authenticated && (
                  <li>
                    <ModalLink
                      className="sign-in"
                      to="/login"
                      component={
                        <Login
                          modal
                          onLoggedIn={() => {
                            props.closeModal();
                          }}
                        />
                      }
                      title="Log in to continue"
                    >
                      Log In
                    </ModalLink>
                  </li>
                )}

                {authenticated && (
                  <li>
                    <div className="user-menu">
                      <div className="user-name">
                        <span>
                          <img src={ScaledImageURL(photo, 'tiny')} alt="" />
                        </span>
                        {firstName}
                      </div>
                      <ul>
                        <li>
                          <Link to="/dashboard">Dashboard</Link>
                        </li>

                        <li>
                          <a
                            href="#logout"
                            onClick={() => {
                              Meteor.logout();
                            }}
                          >
                            <i className="sl sl-icon-power" /> Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                )}
              </ul>
            </nav>

            <div className="clearfix" />
          </div>
        </div>
      </div>
    </header>
  );
};

Header.defaultProps = {
  firstName: '',
  photo: '',
};

Header.propTypes = {
  closeModal: PropTypes.func.isRequired,
  toggleSlideMenu: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  firstName: PropTypes.string,
  photo: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  firstName: state.profile && state.profile.name && state.profile.name.first,
  photo: state.profile && state.profile.photo,
});

export default connect(mapStateToProps, { closeModal, toggleSlideMenu })(Header);
