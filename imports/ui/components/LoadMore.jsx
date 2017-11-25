import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { PrimaryColor } from '../../modules/client/constants';

const LoadMore = ({ onLoadMore, searching }) => (
  <Button
    basic
    color={PrimaryColor}
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
