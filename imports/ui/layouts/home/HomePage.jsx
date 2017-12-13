import React from 'react';
import PropTypes from 'prop-types';

import HomeSearch from './HomeSearch';
import HomeServices from './HomeServices';
import HomeStylists from './HomeStylists';
import HomeJoin from './HomeJoin';

const HomePage = props => (
  <div>
    <HomeSearch />

    {props.services && props.services.length > 0 && <HomeServices services={props.services} />}

    {props.stylists && props.stylists.length > 0 && <HomeStylists stylists={props.stylists} />}

    <HomeJoin />
  </div>
);

HomePage.propTypes = {
  services: PropTypes.array.isRequired,
  stylists: PropTypes.array.isRequired,
};

export default HomePage;
