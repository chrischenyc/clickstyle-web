import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Menu, Responsive, Button, Container, Icon, Label } from 'semantic-ui-react';
import Sticky from 'react-stickynode';
import LoadingBar from 'react-redux-loading-bar';
import _ from 'lodash';

import { closeModal, toggleSlideMenu } from '../../modules/client/redux/ui';
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
      authenticated,
      firstName,
      fullContent,
      searchBar,
      cart,
      isStylist,
      notifications,
      messages,
      pendingBookings,
      pendingCustomerBookings,
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
                <Fragment>
                  <Menu.Item as={Link} to="/join">
                    Become a stylist
                  </Menu.Item>
                  <Menu.Item as={Link} to="/faq">
                    FAQ
                  </Menu.Item>
                </Fragment>
              )}

              {!authenticated && (
                <Fragment>
                  <Menu.Item
                    as={ModalLink}
                    className="sign-in"
                    to="/signup"
                    component={<SignUp modal />}
                    title="Join us"
                  >
                    Sign Up
                  </Menu.Item>
                  <Menu.Item
                    as={ModalLink}
                    className="sign-in"
                    to="/login"
                    component={<Login modal />}
                    title="Log in to continue"
                  >
                    Log In
                  </Menu.Item>
                </Fragment>
              )}

              {authenticated &&
                !_.isEmpty(firstName) && (
                  <Fragment>
                    <Menu.Item as={Link} to="/users/inbox">
                      Inbox {messages > 0 && <Label color="teal">{messages}</Label>}
                    </Menu.Item>

                    <Dropdown text={firstName} className="item">
                      <Dropdown.Menu>
                        <Dropdown.Item
                          as={Link}
                          to="/users/dashboard"
                          text={`Dashboard ${notifications > 0 ? ` (${notifications})` : ''}`}
                        />
                        <Dropdown.Item as={Link} to="/users/inbox" text="Inbox" />
                        <Dropdown.Item as={Link} to="/users/profile" text="Profile" />

                        <Dropdown.Divider />
                        <Dropdown.Item
                          as={Link}
                          to="/users/bookings"
                          text={`My Bookings ${pendingBookings > 0 ? ` (${pendingBookings})` : ''}`}
                        />
                        <Dropdown.Item
                          as={Link}
                          to="/users/booking/stylists"
                          text="Favourite Stylists"
                        />
                        <Dropdown.Item
                          as={Link}
                          to="/users/payment-methods"
                          text="Payment methods"
                        />

                        {isStylist && (
                          <Fragment>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              as={Link}
                              to="/users/stylist/bookings"
                              text={`Customer Bookings ${
                                pendingCustomerBookings > 0 ? ` (${pendingCustomerBookings})` : ''
                              }`}
                            />
                            <Dropdown.Item as={Link} to="/users/stylist/services" text="Services" />
                            <Dropdown.Item as={Link} to="/users/stylist/calendar" text="Calendar" />
                            <Dropdown.Item as={Link} to="/users/stylist/areas" text="Areas" />
                            <Dropdown.Item
                              as={Link}
                              to="/users/stylist/portfolio"
                              text="Portfolio"
                            />
                            <Dropdown.Item as={Link} to="/users/stylist/faq" text="Stylist FAQ" />
                          </Fragment>
                        )}

                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/users/settings" text="Settings" />
                        <Dropdown.Item
                          text="Logout"
                          onClick={() => {
                            Meteor.logout();
                            this.props.history.push('/');
                          }}
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                  </Fragment>
                )}
            </Responsive>

            <Responsive maxWidth={1024} as={Menu.Menu} position="right">
              <Fragment>
                {/* only display cart in header on mobile screen, when cart isn't empty */}
                {cart.showCartInHeader && (
                  <Menu.Item as={Link} to="/booking" style={{ fontSize: '1rem', paddingRight: 0 }}>
                    <Icon name="cart" />
                    {`${formatPrice(cart.total)} (${cart.count})`}
                  </Menu.Item>
                )}
              </Fragment>
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
  notifications: 0,
  messages: 0,
  pendingBookings: 0,
  pendingCustomerBookings: 0,
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
  notifications: PropTypes.number,
  messages: PropTypes.number,
  pendingBookings: PropTypes.number,
  pendingCustomerBookings: PropTypes.number,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  firstName: state.user.profile && state.user.profile.name && state.user.profile.name.first,
  cart: state.cart,
  isStylist: state.user.isStylist,
  notifications: state.user.notifications,
  messages: state.user.messages,
  pendingBookings: state.user.pendingBookings,
  pendingCustomerBookings: state.user.pendingCustomerBookings,
});

export default connect(mapStateToProps, { closeModal, toggleSlideMenu })(withRouter(Header));
