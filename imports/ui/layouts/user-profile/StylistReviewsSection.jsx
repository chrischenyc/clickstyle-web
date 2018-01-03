import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import ScaledImageURL from '../../../modules/scaled-image-url';
import userProfileLink from '../../../modules/user-profile-link';
import { formatDateDisplayString } from '../../../modules/format-date';
import StarRating from '../../components/StarRating';

const StylistReviewsSection = ({ reviews }) => (
  <div id="stylist-profile-reviews" className="listing-section margin-bottom-50">
    <h3 className="listing-desc-headline">
      Reviews&nbsp;<span>{reviews.length}</span>
    </h3>

    <section className="comments listing-reviews">
      <ul>
        {reviews.map(review => (
          <li key={review._id}>
            <div className="avatar">
              <Link to={userProfileLink(review.reviewer)}>
                <img
                  src={ScaledImageURL(
                    review.reviewer.photo || Meteor.settings.public.defaultAvatar,
                    'tiny',
                  )}
                  alt=""
                />
              </Link>
            </div>
            <div className="comment-content">
              <div className="comment-by">
                {`${review.reviewer.name.first} ${review.reviewer.name.last}`}
                <span className="date">{formatDateDisplayString(review.createdAt)}</span>
                <StarRating rating={review.rating} />
              </div>
              <p>{review.comment}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

StylistReviewsSection.propTypes = {
  reviews: PropTypes.array.isRequired,
};

export default StylistReviewsSection;
