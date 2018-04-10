import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Rating } from 'semantic-ui-react';

import scaledImageURL from '../../../modules/scaled-image-url';
import userProfileLink from '../../../modules/user-profile-link';
import { dateString } from '../../../modules/format-date';

const StylistReviewsSection = ({ reviews }) => (
  <div id="stylist-profile-reviews" className="listing-section margin-bottom-50">
    <h3 className="listing-desc-headline">Customer Reviews</h3>

    <section className="comments listing-reviews">
      <ul>
        {reviews.map(review => (
          <li key={review._id}>
            <div className="avatar">
              <Link to={userProfileLink(review.customer)}>
                <img
                  src={scaledImageURL(
                    review.customer.photo || Meteor.settings.public.defaultAvatar,
                    'tiny',
                  )}
                  alt=""
                />
              </Link>
            </div>
            <div className="comment-content">
              <div className="comment-by">
                {`${review.customer.name.first} ${review.customer.name.last}`}
                <span className="date">{dateString(review.createdAt)}</span>
                <Rating icon="star" maxRating={5} defaultRating={review.rating} disabled />
              </div>
              <p>{review.review}</p>
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
