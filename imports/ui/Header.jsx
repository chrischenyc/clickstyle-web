import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Menu } from 'semantic-ui-react';

const HowItWorksButton = () => (
  <Menu.Item link>
    <Link to="/#how-it-works">HOW IT WORKS</Link>
  </Menu.Item>
);

const SignInButton = () => (
  <Menu.Item link>
    <Link to="/login">LOG IN | REGISTER</Link>
  </Menu.Item>
);

const LogOutButton = () => (
  <Menu.Item
    link
    onClick={() => {
      Meteor.logout();
    }}
  >
    LOG OUT
  </Menu.Item>
);

const GuestButtons = () => (
  <Menu.Menu position="right">
    <Menu.Item>
      <HowItWorksButton />
      <SignInButton />
    </Menu.Item>
  </Menu.Menu>
);

const UserButtons = () => (
  <Menu.Menu position="right">
    <HowItWorksButton />
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
