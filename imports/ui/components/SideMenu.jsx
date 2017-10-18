import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = () => (
  <Menu secondary vertical color="teal" size="massive" stackable>
    <Menu.Item>
      <Menu.Header>Account</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/dashboard">
          Dashboard
        </Menu.Item>

        <Menu.Item as={NavLink} to="/inbox">
          Inbox
        </Menu.Item>

        <Menu.Item as={NavLink} to="/profile">
          Profile
        </Menu.Item>

        <Menu.Item as={NavLink} to="/settings">
          Settings
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>Bookings</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/bookings/new">
          Make a booking
        </Menu.Item>

        <Menu.Item as={NavLink} to="/upcoming-bookings">
          Bookings
        </Menu.Item>

        <Menu.Item as={NavLink} to="/past-bookings">
          Past Bookings
        </Menu.Item>

        <Menu.Item as={NavLink} to="/favourites">
          My Favourites
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    {/* TODO: if stylist role, add more menu items */}
  </Menu>
);

export default SideMenu;
