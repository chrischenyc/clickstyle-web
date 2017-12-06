import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';

import HomePage from './HomePage';
import Bookings from '../../../api/bookings/bookings';

const Home = props => <HomePage bookings={props.bookings} />;

Home.defaultProps = {
  bookings: [],
};

Home.propTypes = {
  bookings: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('bookings');

  return {
    bookings: Bookings.find().fetch(),
  };
})(Home);
