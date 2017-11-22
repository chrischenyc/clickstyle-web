import React from 'react';
import PropTypes from 'prop-types';

import StylistsListItem from './StylistsListItem';

const StylistsList = ({ stylists }) => (
  <div>{stylists.map(stylist => <StylistsListItem key={stylist._id} stylist={stylist} />)}</div>
);

StylistsList.propTypes = {
  stylists: PropTypes.array.isRequired,
};

export default StylistsList;
