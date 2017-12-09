import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Container,
  Dropdown,
  Image,
  Menu,
  Visibility,
  Responsive,
  Button,
} from 'semantic-ui-react';

import { closeModal } from '../../modules/client/redux/modal';
import { toggleSlideMenu } from '../../modules/client/redux/ui';
import ModalLink from '../components/ModalLink';
import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';
import ScaledImageURL from '../../modules/scaled-image-url';

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  marginBottom: '1em',
  transition: 'box-shadow 0.5s ease, padding 0.5s ease',
};

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
};

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuFixed: false,
    };
  }

  render() {
    const { menuFixed } = this.state;
    const { authenticated, firstName, photo } = this.props;

    return (
      <Visibility
        onBottomPassed={() => {
          this.setState({ menuFixed: true });
        }}
        onBottomVisible={() => {
          this.setState({ menuFixed: false });
        }}
        once={false}
      >
        <Menu
          borderless
          size="massive"
          fixed={menuFixed ? 'top' : null}
          style={menuFixed ? fixedMenuStyle : menuStyle}
        >
          <Container>
            <Menu.Item id="logo">
              <Link to="/">
                <Image src="images/logo.png" alt="logo" />
              </Link>
            </Menu.Item>

            <Responsive maxWidth={1024} as={Menu.Item}>
              <Button
                icon="bars"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.toggleSlideMenu();
                }}
              />
            </Responsive>

            <Responsive minWidth={1025} as={Menu.Menu} position="right">
              <Menu.Item as={Link} to="/join">
                Become a stylist
              </Menu.Item>

              <Menu.Item as={Link} to="/help">
                Help
              </Menu.Item>

              {!authenticated && (
                <Menu.Item
                  as={ModalLink}
                  className="sign-in"
                  to="/signup"
                  component={
                    <SignUp
                      modal
                      onLoggedIn={() => {
                        this.props.closeModal();
                      }}
                    />
                  }
                  title="Join us"
                >
                  Sign Up
                </Menu.Item>
              )}

              {!authenticated && (
                <Menu.Item
                  as={ModalLink}
                  className="sign-in"
                  to="/login"
                  component={
                    <Login
                      modal
                      onLoggedIn={() => {
                        this.props.closeModal();
                      }}
                    />
                  }
                  title="Log in to continue"
                >
                  Log In
                </Menu.Item>
              )}

              {authenticated && (
                <Dropdown text={firstName || ''} className="item">
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/dashboard" text="Dashboard" />
                    <Dropdown.Item as={Link} to="/inbox" text="Inbox" />
                    <Dropdown.Item as={Link} to="/profiles/edit" text="Profile" />
                    <Dropdown.Item as={Link} to="/settings" text="Settings" />
                    <Dropdown.Item
                      text="Logout"
                      onClick={() => {
                        Meteor.logout();
                      }}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </Responsive>
          </Container>
        </Menu>
      </Visibility>
    );
  }
}

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
