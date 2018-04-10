import React from 'react';
import PropTypes from 'prop-types';
import { Rating, Header } from 'semantic-ui-react';

import { dateTimeString } from '../../../modules/format-date';

const BookingReview = props => (
  <div>
    <Header as="h4">Customer reviewed on {dateTimeString(props.review.createdAt)} </Header>
    <Rating icon="star" maxRating={5} defaultRating={props.review.rating} disabled />
    <p>{props.review.review}</p>
  </div>
);

BookingReview.propTypes = {
  review: PropTypes.object.isRequired,
};

export default BookingReview;
