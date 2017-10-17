import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = () => (
  <Menu secondary vertical color="teal" size="massive" stackable>
    <Menu.Item>
      <Menu.Header>Account</Menu.Header>
      <Menu.Menu>
        <Menu.Item name="Dashboard" as={NavLink} to="/dashboard" />

        <Menu.Item name="Inbox" as={NavLink} to="/inbox" />

        <Menu.Item name="Profile" as={NavLink} to="/profile" />

        <Menu.Item name="Settings" as={NavLink} to="/settings" />
      </Menu.Menu>
    </Menu.Item>

    <Menu.Item>
      <Menu.Header>Bookings</Menu.Header>
      <Menu.Menu>
        <Menu.Item name="Make a booking" as={NavLink} to="/bookings/new" />

        <Menu.Item name="Bookings" as={NavLink} to="/upcoming-bookings" />

        <Menu.Item name="Past Bookings" as={NavLink} to="/past-bookings" />

        <Menu.Item name="My Favourites" as={NavLink} to="/favourites" />
      </Menu.Menu>
    </Menu.Item>

    {/* TODO: if stylist role, add more menu items */}
  </Menu>
);

export default SideMenu;
