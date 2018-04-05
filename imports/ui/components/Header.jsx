import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Menu, Responsive, Button, Container, Icon } from 'semantic-ui-react';
import Sticky from 'react-stickynode';
import LoadingBar from 'react-redux-loading-bar';

import { closeModal } from '../../modules/client/redux/ui';
import { toggleSlideMenu } from '../../modules/client/redux/ui';
import ModalLink from './ModalLink';
import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';
import SearchBar from './SearchBar/SearchBar';
import formatPrice from '../../modules/format-price';

const menuStyle = {
  border: 'none',
  borderRadius: 0,
  boxShadow: 'none',
  display: 'block',
};

const fixedMenuStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  borderRadius: 0,
  boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
  display: 'block',
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
    const {
      authenticated, firstName, fullContent, searchBar, cart, isStylist,
    } = this.props;

    return (
      <Sticky
        onStateChange={(status) => {
          this.setState({ menuFixed: status.status === Sticky.STATUS_FIXED });
        }}
        innerZ={999}
      >
        <Menu
          borderless
          size="massive"
          style={menuFixed || !fullContent ? fixedMenuStyle : menuStyle}
        >
          <LoadingBar style={{ backgroundColor: '#00aca4' }} />
          <Container fluid>
            {fullContent && (
              <Menu.Item id="logo">
                <Link to="/">
                  <img src="/images/logo.png" alt="logo" />
                </Link>
              </Menu.Item>
            )}

            <Responsive maxWidth={1024} as={Menu.Item} style={{ paddingLeft: '0' }}>
              <Button
                basic
                color="teal"
                icon="bars"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.toggleSlideMenu();
                }}
              />
            </Responsive>

            <Responsive minWidth={1025} as={Menu.Menu} position="right">
              {fullContent && (
                <Menu.Item as={Link} to="/join">
                  Become a stylist
                </Menu.Item>
              )}

              {fullContent && (
                <Menu.Item as={Link} to="/faq">
                  FAQ
                </Menu.Item>
              )}

              {!authenticated && (
                <Menu.Item
                  as={ModalLink}
                  className="sign-in"
                  to="/signup"
                  component={<SignUp modal />}
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
                  component={<Login modal />}
                  title="Log in to continue"
                >
                  Log In
                </Menu.Item>
              )}

              {authenticated && (
                <Dropdown text={firstName || ''} className="item">
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/users/dashboard" text="Dashboard" />
                    <Dropdown.Item as={Link} to="/users/bookings" text="Bookings" />
                    <Dropdown.Item as={Link} to="/users/inbox" text="Inbox" />
                    <Dropdown.Item as={Link} to="/users/profile" text="Profile" />
                    <Dropdown.Item as={Link} to="/users/settings" text="Settings" />
                    {isStylist && (
                      <Fragment>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          as={Link}
                          to="/users/stylist/bookings"
                          text="Customer Bookings"
                        />
                      </Fragment>
                    )}
                    <Dropdown.Divider />
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

            <Responsive maxWidth={1024} as={Menu.Menu} position="right">
              {/* only display cart in header on mobile screen, when cart isn't empty */}
              {cart.showCartInHeader && (
                <Menu.Item as={Link} to="/booking" style={{ fontSize: '1rem', paddingRight: 0 }}>
                  <Icon name="cart" />
                  {`${formatPrice(cart.total)} (${cart.count})`}
                </Menu.Item>
              )}
            </Responsive>
          </Container>

          {searchBar && (
            <Responsive minWidth={1025} className="container margin-bottom-10">
              <SearchBar />
            </Responsive>
          )}
        </Menu>
      </Sticky>
    );
  }
}

Header.defaultProps = {
  firstName: '',
  fullContent: true,
  searchBar: false,
  isStylist: false,
};

Header.propTypes = {
  closeModal: PropTypes.func.isRequired,
  toggleSlideMenu: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  firstName: PropTypes.string,
  fullContent: PropTypes.bool, // if false, header links only contain user menu
  searchBar: PropTypes.bool,
  cart: PropTypes.object.isRequired,
  isStylist: PropTypes.bool,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  firstName: state.user.profile && state.user.profile.name && state.user.profile.name.first,
  cart: state.cart,
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps, { closeModal, toggleSlideMenu })(Header);
