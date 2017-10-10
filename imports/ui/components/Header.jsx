import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Menu, Dropdown, Responsive } from 'semantic-ui-react';
import { userSignedOut } from '../../redux/user';

const Header = props => (
  <Responsive as={Menu} minWidth={568} fixed="top" size="huge" inverted borderless>
    <Container>
      <Menu.Item as={Link} to="/">
        STYLESQUARD
      </Menu.Item>
      {props.authenticated ? (
        <Menu.Menu position="right">
          <Dropdown text="ACCOUNT" className="item">
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to="/dashboard" text="Dashboard" />
              <Dropdown.Item as={NavLink} to="/profile" text="Profile" />
              <Dropdown.Item as={NavLink} to="/settings" text="Settings" />
              <Dropdown.Item
                text="Logout"
                onClick={() => {
                  Meteor.logout(() => {
                    props.userSignedOut();
                  });
                }}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      ) : (
        <Menu.Menu position="right">
          <Menu.Item as={NavLink} to="/login">
            LOG IN | REGISTER
          </Menu.Item>
        </Menu.Menu>
      )}
    </Container>
  </Responsive>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  userSignedOut: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { userSignedOut })(Header);
