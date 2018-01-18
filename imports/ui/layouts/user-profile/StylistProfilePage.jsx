import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Responsive } from 'semantic-ui-react';
import classNames from 'classnames';

import userNameWithGreeting from '../../../modules/client/user-name-with-greeting';
import ScaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import { formatMonthYear } from '../../../modules/format-date';

import StylistServiceSection from './StylistServiceSection';
import StylistReviewsSection from './StylistReviewsSection';
import StylistPortfolioSection from './StylistPortfolioSection';
import StylistBookingSection from './StylistBookingSection';
import StylistHoursSection from './StylistHoursSection';
import StylistShareSection from './StylistShareSection';

const UserProfilePage = ({
  user,
  favourStylist,
  authenticated,
  userId,
  onServiceSelected,
  onBook,
}) => {
  if (_.isNil(user)) {
    return <Loading />;
  }

  const { profile, stylist } = user;

  return (
    <div>
      <div className="profile-header">
        {stylist.portfolioPhotos &&
          stylist.portfolioPhotos.length > 0 && (
            <StylistPortfolioSection photos={stylist.portfolioPhotos} />
          )}

        {(_.isNil(stylist.portfolioPhotos) || stylist.portfolioPhotos.length === 0) && (
          <div className="profile-header-bg" />
        )}

        <div className="large-avatar" id="avatar">
          <img
            alt=""
            src={ScaledImageURL(profile.photo || Meteor.settings.public.defaultAvatar, 'tiny')}
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
            {profile.createdAt && <span>Joined in {formatMonthYear(profile.createdAt)}</span>}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* -- Content -- */}
          <div className="col-lg-8 col-md-8 margin-top-50">
            {/* -- About, Products -- */}
            {(!_.isEmpty(profile.about) || !_.isEmpty(profile.products)) && (
              <div id="stylist-profile-overview" className="listing-section margin-bottom-50">
                {!_.isEmpty(profile.about) && <p>{profile.about}</p>}

                {!_.isEmpty(profile.products) && (
                  <p>Products used: {profile.products.map(product => product.name).join(', ')}</p>
                )}

                {/* -- mobile version content before price list -- */}
                <Responsive maxWidth={1024}>
                  {/* -- Open Hours -- */}
                  {stylist.openHours && <StylistHoursSection openHours={stylist.openHours} />}
                </Responsive>
              </div>
            )}

            {/* -- Services -- */}
            <div id="stylist-profile-pricing-list" className="listing-section margin-bottom-50">
              <h3 className="listing-desc-headline">Services</h3>

              <div className="pricing-list-container">
                {stylist.services &&
                  stylist.services.map(service => (
                    <StylistServiceSection
                      key={service._id}
                      service={service}
                      onServiceSelected={onServiceSelected}
                    />
                  ))}
              </div>
            </div>

            <Responsive maxWidth={1024}>
              {/* -- Share / Like -- */}
              <div className="margin-bottom-35">
                <StylistShareSection
                  stylist={user.stylist}
                  userId={userId}
                  authenticated={authenticated}
                  favourStylist={favourStylist}
                />
              </div>
            </Responsive>

            {/* -- Reviews -- */}
            {stylist.reviews &&
              stylist.reviews.length > 0 && <StylistReviewsSection reviews={stylist.reviews} />}
          </div>

          {/* -- Sidebar for desktop version -- */}
          <Responsive minWidth={1025} className="col-lg-4 col-md-4 margin-top-50">
            {/* only display book section if stylist is not current user */}
            {(_.isNil(userId) || userId !== stylist.owner) && (
              <div className="boxed-widget booking-widget">
                <StylistBookingSection onBook={onBook} />
              </div>
            )}

            {/* -- Opening Hours -- */}
            <div
              className={classNames({
                'margin-top-35': _.isNil(userId) || userId !== stylist.owner,
              })}
            >
              {stylist.openHours && <StylistHoursSection openHours={stylist.openHours} />}
            </div>

            {/* -- Share / Like -- */}
            <div className="margin-top-35 margin-bottom-35">
              <StylistShareSection
                stylist={user.stylist}
                userId={userId}
                authenticated={authenticated}
                favourStylist={favourStylist}
              />
            </div>
          </Responsive>
        </div>
      </div>
    </div>
  );
};

UserProfilePage.defaultProps = {
  user: null,
  userId: null,
};

UserProfilePage.propTypes = {
  user: PropTypes.object,
  favourStylist: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  onServiceSelected: PropTypes.func.isRequired,
  onBook: PropTypes.func.isRequired,
};

export default UserProfilePage;
