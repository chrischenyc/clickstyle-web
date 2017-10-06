import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu, Dropdown } from 'semantic-ui-react';

const HowItWorksButton = () => (
  <Menu.Item link>
    <Link to="/#how-it-works">HOW IT WORKS</Link>
  </Menu.Item>
);

const SignInButton = () => (
  <Menu.Item as={Link} to="/login">
    LOG IN | REGISTER
  </Menu.Item>
);

const AccountButton = () => (
  <Dropdown text="ACCOUNT" className="link item">
    <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/dashboard" text="Dashboard" />
      <Dropdown.Item as={Link} to="/profile" text="Profile" />
      <Dropdown.Item as={Link} to="/settings" text="Settings" />
    </Dropdown.Menu>
  </Dropdown>
);

const LogOutButton = () => (
  <Menu.Item
    onClick={() => {
      Meteor.logout();
    }}
  >
    LOG OUT
  </Menu.Item>
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
    <LogOutButton />
  </Menu.Menu>
);

const Header = props => (
  <Menu fixed="top" size="large" inverted borderless>
    <Container>
      <Menu.Item link>
        <Link to="/">STYLESQUARD</Link>
      </Menu.Item>

      {props.currentUser ? <UserButtons /> : <GuestButtons />}
    </Container>
  </Menu>
);

export default withTracker(() => ({
  currentUser: Meteor.user(),
}))(Header);
