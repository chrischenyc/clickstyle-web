import React from 'react';
import PropTypes from 'prop-types';

import HomeSearchBanner from './HomeSearchBanner';
import HomeServices from './HomeServices';
import HomeJoin from './HomeJoin';

const HomePage = props => (
  <div>
    <HomeSearchBanner />
    {props.services && props.services.length > 0 && <HomeServices services={props.services} />}

    <HomeJoin />
  </div>
);

HomePage.propTypes = {
  services: PropTypes.array.isRequired,
};

export default HomePage;
