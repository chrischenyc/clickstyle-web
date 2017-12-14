import React from 'react';
import PropTypes from 'prop-types';

import HomeSearch from './HomeSearch';
import HomeServices from './HomeServices';
import HomeStylists from './HomeStylists';
import HomeJoin from './HomeJoin';

const HomePage = props => (
  <div>
    <HomeSearch />

    {props.services &&
      props.services.length > 0 &&
      !props.authenticated && <HomeServices services={props.services} />}

    {props.stylists &&
      props.stylists.length > 0 && (
        <HomeStylists stylists={props.stylists} locationBased={props.isStylistsLocationBased} />
      )}

    {props.services &&
      props.services.length > 0 &&
      props.authenticated && <HomeServices services={props.services} />}

    <HomeJoin />
  </div>
);

HomePage.propTypes = {
  services: PropTypes.array.isRequired,
  stylists: PropTypes.array.isRequired,
  authenticated: PropTypes.bool.isRequired,
  isStylistsLocationBased: PropTypes.bool.isRequired,
};

export default HomePage;
