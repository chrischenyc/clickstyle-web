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

const StylistsListItem = ({ stylist }) => (
  <div className="col-lg-4 col-md-6 margin-bottom-20">
    <Link to={`/users/show/${stylist.owner}`} className="listing-item-container">
      <div className="listing-item">
        <img src={_.sample(dummyBanners)} alt="" />

        <div className="listing-item-content">
          <Image
            size="mini"
            circular
            src={ScaledImageURL(
              stylist.profile.photo || Meteor.settings.public.image.defaultProfilePhoto,
              'tiny',
            )}
          />
          <h3>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</h3>
          <span>{`${stylist.profile.address.suburb}, ${stylist.profile.address.state}`}</span>
        </div>
      </div>

      <div className="listing-item-info">
        <div className="services-blurb">
          {stylist.services.map(service => service.name).join(', ')}
        </div>
        {stylist.services.map(service => (
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
