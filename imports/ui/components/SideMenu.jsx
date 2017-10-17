import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

const SideMenu = () => (
  <Menu secondary vertical color="teal" size="massive" stackable compact>
    <Menu.Item name="Dashboard" as={NavLink} to="/dashboard" />
    <Menu.Item name="Profile" as={NavLink} to="/profile" />
    <Menu.Item name="Bookings" as={NavLink} to="/my-bookings" />
    <Menu.Item name="Messages" as={NavLink} to="/messages" />
    <Menu.Item name="Settings" as={NavLink} to="/settings" />
  </Menu>
);

export default SideMenu;
