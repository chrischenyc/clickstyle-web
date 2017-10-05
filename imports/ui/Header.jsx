import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react';

import AccountsUIWrapper from '../ui/AccountsUIWrapper';

const GuestButtons = () => (
  <Menu.Menu position="right">
    <Menu.Item>
      <AccountsUIWrapper />
    </Menu.Item>
  </Menu.Menu>
);

const UserButtons = () => (
  <Menu.Menu position="right">
    <Menu.Item>
      <Button
        as="a"
        inverted
        onClick={() => {
          Meteor.logout();
        }}
      >
        Log out
      </Button>
    </Menu.Item>
  </Menu.Menu>
);

const Header = props => (
  <Menu fixed="top" size="large" inverted>
    <Container>
      <Menu.Item as="a" inverted>
        <Link to="/">Home</Link>
      </Menu.Item>

      {props.currentUser ? <UserButtons /> : <GuestButtons />}
    </Container>
  </Menu>
);

export default withTracker(() => ({
  currentUser: Meteor.user(),
}))(Header);
