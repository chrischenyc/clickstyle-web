import React from 'react';
import PropTypes from 'prop-types';

import HomeSearch from './HomeSearch';
import HomeServices from './HomeServices';
import HomeJoin from './HomeJoin';

const HomePage = props => (
  <div>
    <HomeSearch />

    {props.services && props.services.length > 0 && <HomeServices services={props.services} />}

    <HomeJoin />
  </div>
);

HomePage.propTypes = {
  services: PropTypes.array.isRequired,
};

export default HomePage;
