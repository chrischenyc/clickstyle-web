import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import scaledImageURL from '../../../modules/scaled-image-url';

const HomeStylistsItem = ({ stylist }) => (
  <Link to={`/users/show/${stylist.owner}`} className="listing-item-container">
    <div className="listing-item">
      <img
        src={
          stylist.profile.photo
            ? scaledImageURL(stylist.profile.photo, 'small')
            : '/images/placeholder-square.jpg'
        }
        alt={stylist.profile.name}
      />

      <div className="listing-item-content">
        <h3>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</h3>

        {stylist.services &&
          stylist.services.length && (
            <span style={{ fontSize: '1em' }}>
              {stylist.services.map(service => service.name).join(', ')}
            </span>
          )}
      </div>
    </div>
  </Link>
);

HomeStylistsItem.propTypes = {
  stylist: PropTypes.object.isRequired,
};

export default HomeStylistsItem;
