import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import scaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import userNameWithGreeting from '../../../modules/client/user-name-with-greeting';
import { monthYearString } from '../../../modules/format-date';

const UserProfilePage = ({ profile }) => {
  if (_.isNil(profile)) {
    return <Loading />;
  }

  return (
    <Fragment>
      <div className="profile-header">
        <div className="profile-header-bg" />

        <div className="large-avatar" id="avatar">
          <img
            alt=""
            src={scaledImageURL(profile.photo || Meteor.settings.public.defaultAvatar, 'tiny')}
          />
        </div>

        <div className="profile-header-info">
          <h2 className="title">{userNameWithGreeting(profile.name)}</h2>

          <div className="desc">
            {profile.address &&
              profile.address.suburb &&
              `${profile.address.suburb}, ${profile.address.state}`}
            {profile.address &&
              profile.address.suburb &&
              profile.createdAt && <span style={{ padding: '0 8px' }}>&middot;</span>}
            {profile.createdAt && <span>Joined in {monthYearString(profile.createdAt)}</span>}
          </div>
        </div>
      </div>

      <div className="container margin-top-60 margin-bottom-60">
        <div className="row">
          <div className="col-12">
            {!_.isEmpty(profile.about) && (
              <div className="boxed-widget margin-bottom-10">
                <h3>About me</h3>
                <ul className="listing-details-sidebar">{profile.about}</ul>
                <div className="clearfix" />
              </div>
            )}

            {profile.products &&
              profile.products.length > 0 && (
                <div className="boxed-widget margin-bottom-10">
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
    </Fragment>
  );
};

UserProfilePage.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default UserProfilePage;
