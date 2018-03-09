import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import scaledImageURL from '../../../modules/scaled-image-url';
import userProfileLink from '../../../modules/user-profile-link';

const limitedArray = (objects, size) => {
  if (objects.length >= size) {
    return objects.slice(0, size);
  }

  return objects;
};

const StylistsListItem = ({ stylist }) => (
  <div className="col-lg-4 col-md-6 margin-bottom-20">
    <Link to={userProfileLink(stylist)} className="listing-item-container">
      <div className="listing-item">
        <img src={stylist.bannerPhotos[0]} alt="" />

        <div className="listing-item-content vertical-centered">
          <div id="avatar" className="small-avatar">
            <img
              src={scaledImageURL(stylist.photo || Meteor.settings.public.defaultAvatar, 'tiny')}
              alt=""
            />
          </div>
          <div>
            <h3>{`${stylist.name.first} ${stylist.name.last}`}</h3>
            <span>
              {stylist.address.suburb && `${stylist.address.suburb}, ${stylist.address.state}`}
            </span>
          </div>
        </div>
      </div>

      <div className="listing-item-info">
        <div className="services-blurb">
          {stylist.services.map(service => service.name).join(', ')}
        </div>
        {limitedArray(stylist.services, 3).map(service => (
          <div key={service._id}>{`${service.name} from $${service.basePrice}`}</div>
        ))}
      </div>
    </Link>
  </div>
);

StylistsListItem.propTypes = {
  stylist: PropTypes.object.isRequired,
};

export default StylistsListItem;
