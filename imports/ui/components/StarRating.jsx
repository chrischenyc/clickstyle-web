import React from 'react';
import PropTypes from 'prop-types';

const StarRating = ({ rating }) => {
  const starClasses = [];
  for (let index = 1; index <= 5; index += 1) {
    if (index <= rating) {
      starClasses.push('star');
    } else {
      starClasses.push('star empty');
    }
  }

  return (
    <div className="star-rating">
      {starClasses.map((starClass, index) => <span key={index} className={starClass} />)}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

export default StarRating;
