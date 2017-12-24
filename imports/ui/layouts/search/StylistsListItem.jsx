import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import _ from 'lodash';

import ScaledImageURL from '../../../modules/scaled-image-url';

const dummyBanners = [
  'http://res.cloudinary.com/stylesquard/image/upload/v1511498808/banner1_wahqwj',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511498807/banner2_nzwd8s',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511499198/banner4_e0qb2e',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511499199/banner3_wzdcon',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511499198/banner5_u7lgpc',
];

const limitedArray = (objects, size) => {
  if (objects.length >= size) {
    return objects.slice(0, size);
  }

  return objects;
};

const StylistsListItem = ({ stylist }) => (
  <div className="col-lg-4 col-md-6 margin-bottom-20">
    <Link
      to={`/users/show/${
        stylist.owner
      }/${stylist.name.first.toLowerCase()}${stylist.name.last.toLowerCase()}`}
      className="listing-item-container"
    >
      <div className="listing-item">
        <img src={_.sample(dummyBanners)} alt="" />

        <div className="listing-item-content vertical-centered">
          <Image
            id="avatar"
            size="mini"
            circular
            src={ScaledImageURL(
              stylist.photo || Meteor.settings.public.image.defaultProfilePhoto,
              'tiny',
            )}
          />
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
