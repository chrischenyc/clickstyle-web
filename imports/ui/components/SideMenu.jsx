import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';

import ScaledImageURL from '../../modules/scaled-image-url';

const SideMenu = ({ profile, isStylist }) => (
  <Menu secondary vertical color={Meteor.settings.public.semantic.color} size="massive" stackable>
    {profile.photoURL && (
      <Menu.Item>
        <Image src={ScaledImageURL(profile.photoURL, 'tiny')} size="tiny" avatar />
      </Menu.Item>
    )}

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
        <Menu.Item as={NavLink} to="/bookings">
          My Bookings
        </Menu.Item>

        <Menu.Item as={NavLink} to="/favourites">
          My Favourites
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    {isStylist && (
      <Menu.Item>
        <Menu.Header>Stylist</Menu.Header>
        <Menu.Menu>
          <Menu.Item as={NavLink} to="/stylists/services">
            Services &amp; Prices
          </Menu.Item>
          <Menu.Item as={NavLink} to="/stylists/availability">
            Availability
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    )}
  </Menu>
);

SideMenu.propTypes = {
  isStylist: false,
};

SideMenu.propTypes = {
  profile: PropTypes.object.isRequired,
  isStylist: PropTypes.bool,
};

const mapStateToProps = state => ({
  profile: state.profile,
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps)(SideMenu);
