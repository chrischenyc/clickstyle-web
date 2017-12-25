import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '../components/elements';

const LoadMore = ({ onLoadMore, searching }) => (
  <Button
    basic
    color="teal"
    content="Load More"
    onClick={onLoadMore}
    loading={searching}
    disabled={searching}
  />
);

LoadMore.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
};

export default LoadMore;
