import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ScaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import OpenHourString from '../../../modules/client/OpenHourString';

import StylistServices from './StylistServices';

const UserProfilePage = ({ user }) => {
  if (_.isNil(user)) {
    return <Loading />;
  }

  const { profile, stylist } = user;

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

                  {// TODO: add stylist reviews
                  stylist &&
                    stylist.reviews && (
                      <div className="star-rating">
                        <div className="rating-counter">
                          <a href="#listing-reviews">(60 reviews)</a>
                        </div>
                      </div>
                    )}

                  {stylist && (
                    <div>
                      <button className="button">Book Now</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row sticky-wrapper">
          <div className="col-lg-4 col-md-4 margin-top-0">
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

              {stylist &&
                stylist.openHours &&
                stylist.openHours.length > 0 && (
                  <div className="margin-top-30">
                    <h3>Available time</h3>
                    <ul className="listing-details-sidebar">
                      {stylist.openHours.map(openHour => (
                        <li key={openHour.day}>{OpenHourString(openHour)}</li>
                      ))}
                    </ul>
                    <div className="clearfix" />
                  </div>
                )}
            </div>
          </div>

          <div className="col-lg-8 col-md-8 padding-left-30">
            {stylist &&
              stylist.services &&
              stylist.services.length > 0 && <StylistServices services={stylist.services} />}
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
