import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import HomeSearch from './HomeSearch';
import HomeServices from './HomeServices';
import HomeStylists from './HomeStylists';
import HomeJoin from './HomeJoin';

const HomePage = props => (
  <Fragment>
    <HomeSearch />

    {!props.isStylistsLocationBased && <HomeServices services={props.services} />}

    <HomeStylists stylists={props.stylists} locationBased={props.isStylistsLocationBased} />

    {props.isStylistsLocationBased && <HomeServices services={props.services} />}

    <HomeJoin />
  </Fragment>
);

HomePage.propTypes = {
  services: PropTypes.array.isRequired,
  stylists: PropTypes.array.isRequired,
  isStylistsLocationBased: PropTypes.bool.isRequired,
};

export default HomePage;
