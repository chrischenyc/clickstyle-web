import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Menu, Image } from 'semantic-ui-react';

import ScaledImageURL from '../../modules/scaled-image-url';
import { PrimaryColor } from '../../modules/client/constants';

const SideMenu = ({ profile, isStylist }) => (
  <Menu secondary vertical color={PrimaryColor} size="massive" stackable>
    {profile.photoURL && (
      <Menu.Item>
        <Image src={ScaledImageURL(profile.photoURL, 'tiny')} size="tiny" avatar />
      </Menu.Item>
    )}

    <Menu.Item>
      <Menu.Header>Account</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/users/dashboard">
          Dashboard
        </Menu.Item>

        <Menu.Item as={NavLink} to="/users/inbox">
          Inbox
        </Menu.Item>

        <Menu.Item as={NavLink} to="/users/profile">
          Profile
        </Menu.Item>

        <Menu.Item as={NavLink} to="/users/settings">
          Settings
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item>

    {/* <Menu.Item>
      <Menu.Header>Bookings</Menu.Header>
      <Menu.Menu>
        <Menu.Item as={NavLink} to="/bookings">
          My Bookings
        </Menu.Item>

        <Menu.Item as={NavLink} to="/favourites">
          My Favourites
        </Menu.Item>
      </Menu.Menu>
    </Menu.Item> */}

    {isStylist && (
      <Menu.Item>
        <Menu.Header>Stylist</Menu.Header>
        <Menu.Menu>
          <Menu.Item as={NavLink} to="/users/stylist/services">
            Service &amp; Price List
          </Menu.Item>
          <Menu.Item as={NavLink} to="/users/stylist/calendar">
            Calendar
          </Menu.Item>
          <Menu.Item as={NavLink} to="/users/stylist/areas">
            Areas
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
