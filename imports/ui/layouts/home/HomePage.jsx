import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import HomeSearchBanner from './HomeSearchBanner';
import BookingsList from '../bookings/BookingsList';
import HomeJoinBanner from './HomeJoinBanner';

const HomePage = props => (
  <div>
    <HomeSearchBanner />

    <Segment
      textAlign="center"
      style={{
        padding: '2rem 0',
      }}
      vertical
    >
      <BookingsList bookings={props.bookings} />
    </Segment>

    <HomeJoinBanner />
  </div>
);

HomePage.propTypes = {
  bookings: PropTypes.array.isRequired,
};

export default HomePage;
