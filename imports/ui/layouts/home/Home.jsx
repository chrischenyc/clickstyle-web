import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

import HomePage from './HomePage';
import Services from '../../../api/services/services';

const Home = props => <HomePage services={props.services} />;

Home.defaultProps = {
  services: [],
};

Home.propTypes = {
  services: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('services');

  return {
    services: Services.find({}, { sort: { displayOrder: 1 } }).fetch(),
  };
})(Home);
