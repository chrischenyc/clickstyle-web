import { Meteor } from 'meteor/meteor';

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';

const HowItWorksButton = () => (
  <Menu.Item as={NavLink} to="/#how-it-works">
    HOW IT WORKS
  </Menu.Item>
);

const SignInButton = () => (
  <Menu.Item as={NavLink} to="/login">
    LOG IN | REGISTER
  </Menu.Item>
);

const AccountButton = () => (
  <Dropdown text="ACCOUNT" className="item">
    <Dropdown.Menu>
      <Dropdown.Item as={NavLink} to="/dashboard" text="Dashboard" />
      <Dropdown.Item as={NavLink} to="/profile" text="Profile" />
      <Dropdown.Item as={NavLink} to="/settings" text="Settings" />
      <Dropdown.Item
        text="Logout"
        onClick={() => {
          Meteor.logout();
        }}
      />
    </Dropdown.Menu>
  </Dropdown>
);

const GuestButtons = () => (
  <Menu.Menu position="right">
    <HowItWorksButton />
    <SignInButton />
  </Menu.Menu>
);

const UserButtons = () => (
  <Menu.Menu position="right">
    <HowItWorksButton />
    <AccountButton />
  </Menu.Menu>
);

const Header = ({ authenticated }) => (
  <Responsive as={Menu} minWidth={568} fixed="top" size="huge" inverted borderless>
    <Container>
      <Menu.Item as={Link} to="/">
        STYLESQUARD
      </Menu.Item>
      {authenticated ? <UserButtons /> : <GuestButtons />}
    </Container>
  </Responsive>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default Header;
