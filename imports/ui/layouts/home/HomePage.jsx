import React from 'react';
import PropTypes from 'prop-types';

import HomeSearchBanner from './HomeSearchBanner';
import HomeServices from './HomeServices';
import HomeJoin from './HomeJoin';

const HomePage = props => (
  <div>
    <HomeSearchBanner />
    <HomeServices />

    <HomeJoin />
  </div>
);

HomePage.propTypes = {};

export default HomePage;
