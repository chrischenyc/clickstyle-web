import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const LoadMore = ({ onLoadMore, searching }) => (
  <Button
    basic
    color={Meteor.settings.public.semantic.color}
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
