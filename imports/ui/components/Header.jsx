import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';

const Header = ({ authenticated }) => (
  <Responsive as={Menu} fixed="top" size="huge" inverted borderless stackable>
    <Container>
      <Menu.Item as={Link} to="/">
        STYLESQUARD
      </Menu.Item>
      {authenticated ? (
        <Menu.Menu position="right">
          <Dropdown text="ACCOUNT" className="item">
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/dashboard" text="Dashboard" />
              <Dropdown.Item as={Link} to="/inbox" text="Inbox" />
              <Dropdown.Item as={Link} to="/profile" text="Profile" />
              <Dropdown.Item as={Link} to="/settings" text="Settings" />
              <Dropdown.Item
                text="Logout"
                onClick={() => {
                  Meteor.logout();
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/login">
            LOG IN
          </Menu.Item>
          <Menu.Item as={Link} to="/signup">
            SIGN UP
          </Menu.Item>
        </Menu.Menu>
      )}
    </Container>
  </Responsive>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Header);
