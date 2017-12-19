import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ScaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';

const UserProfilePage = ({ user }) => {
  if (_.isNil(user)) {
    return <Loading />;
  }

  const { profile } = user;

  const photo = profile.photo || Meteor.settings.public.image.defaultProfilePhoto;

  return (
    <div>
      <div id="titlebar" className="gradient">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="user-profile-titlebar">
                <div className="user-profile-avatar">
                  <img src={ScaledImageURL(photo, 'tiny')} alt="" />
                </div>

                <div className="user-profile-name">
                  <h2>{`${profile.name.first} ${profile.name.last}`}</h2>

                  {profile && profile.about && <p>{profile.about}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row sticky-wrapper">
          <div className="col-lg-12 col-md-12 margin-top-0">
            <div className="boxed-widget margin-bottom-50">
              {profile &&
                profile.products &&
                profile.products.length > 0 && (
                  <div>
                    <h3>Products used</h3>
                    <ul className="listing-details-sidebar">
                      {profile.products.map(product => (
                        <li key={product.productId} style={{ display: 'inline', float: 'left' }}>
                          {product.name}
                        </li>
                      ))}
                    </ul>
                    <div className="clearfix" />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfilePage.defaultProps = {
  user: null,
};

UserProfilePage.propTypes = {
  user: PropTypes.object,
};

export default UserProfilePage;
