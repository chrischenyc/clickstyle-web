import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';

const StylistsListItem = ({ stylist }) => (
  <div>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</div>
);

StylistsListItem.propTypes = {
  stylist: PropTypes.object.isRequired,
};

export default StylistsListItem;
