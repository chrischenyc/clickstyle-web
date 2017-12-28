import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ShareButtons } from 'react-share';
import { Button, Icon } from 'semantic-ui-react';

import userNameWithGreeting from '../../../modules/client/user-name-with-greeting';
import ScaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import { dayOfWeekAsString, formatMonthYear } from '../../../modules/format-date';
import OpenHourString from '../../../modules/client/OpenHourString';

import StylistServiceSection from './StylistServiceSection';
import StylistReviewsSection from './StylistReviewsSection';
import StylistPortfolioSection from './StylistPortfolioSection';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;

const UserProfilePage = ({ user, favourStylist, authenticated }) => {
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

        <div className="large-avatar">
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
          <div className="col-lg-8 col-md-8 margin-top-70">
            {/* -- About -- */}
            {!_.isEmpty(profile.about) && (
              <div id="stylist-profile-overview" className="listing-section margin-bottom-50">
                <h3 className="listing-desc-headline">About me</h3>

                <p>{profile.about}</p>
              </div>
            )}

            {/* -- Products -- */}
            {!_.isEmpty(profile.products) && (
              <div id="stylist-profile-overview" className="listing-section margin-bottom-50">
                <h3 className="listing-desc-headline">Products used</h3>

                <p>{profile.products.map(product => product.name).join(', ')}</p>
              </div>
            )}

            {/* -- Services -- */}
            <div id="stylist-profile-pricing-list" className="listing-section margin-bottom-50">
              <h3 className="listing-desc-headline">Services</h3>

              <div className="pricing-list-container">
                {stylist.services &&
                  stylist.services.map(service => (
                    <StylistServiceSection key={service._id} service={service} />
                  ))}
              </div>
            </div>

            {stylist.reviews &&
              stylist.reviews.length > 0 && <StylistReviewsSection reviews={stylist.reviews} />}
          </div>

          {/* -- Sidebar -- */}
          <div className="col-lg-4 col-md-4 margin-top-70">
            {/* -- Book Now -- */}
            <div className="boxed-widget booking-widget">
              <h3>
                <i className="fa fa-calendar-check-o " /> Make a booking
              </h3>
              <div className="row with-forms  margin-top-0">
                {/* -- Date Picker - docs: http://www.vasterad.com/docs/listeo/#!/date_picker -- */}
                <div className="col-lg-6 col-md-12">
                  <input
                    type="text"
                    id="booking-date"
                    data-lang="en"
                    data-large-mode="true"
                    data-large-default="true"
                    data-min-year="2017"
                    data-max-year="2020"
                    data-disabled-days="08/17/2017,08/18/2017"
                  />
                </div>

                {/* -- Time Picker - docs: http://www.vasterad.com/docs/listeo/#!/time_picker -- */}
                <div className="col-lg-6 col-md-12">
                  <input type="text" id="booking-time" value="9:00 am" />
                </div>

                {/* TODO: add selected service/addon */}
              </div>

              {/* -- progress button animation handled via custom.js -- */}
              <Button circular size="huge" fluid color="teal" className="margin-top-5">
                Book Now
              </Button>
            </div>

            {/* -- Opening Hours -- */}
            <div className="boxed-widget opening-hours margin-top-35">
              <h3>
                <i className="sl sl-icon-clock" /> Opening Hours
              </h3>
              <ul>
                {stylist.openHours &&
                  stylist.openHours.map(openHour => (
                    <li key={openHour.day}>
                      {dayOfWeekAsString(openHour.day)}
                      <span>{OpenHourString(openHour)}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* -- Share / Like -- */}
            <div className="listing-share margin-top-35 margin-bottom-35 no-border">
              {authenticated && (
                <Button
                  circular
                  basic={!stylist.favoured}
                  color="red"
                  onClick={favourStylist}
                  className="margin-bottom-10"
                >
                  <Icon name="heart" />
                  {stylist.favoured ? 'Un-favourite' : 'Favourite'}&nbsp;this stylist
                </Button>
              )}
              {stylist.favourites &&
                stylist.favourites.length > 0 && (
                  <span>{stylist.favourites.length} favourites</span>
                )}

              {/* -- Share Buttons -- */}
              <ul className="share-buttons margin-top-20 margin-bottom-0">
                <li>
                  <FacebookShareButton
                    url={window.location.href}
                    quote={`check this stylist I found on @${Meteor.settings.public.facebookId}`}
                  >
                    <Button circular color="facebook">
                      Share on Facebook
                    </Button>
                  </FacebookShareButton>
                </li>
                <li>
                  <TwitterShareButton
                    url={window.location.href}
                    title="check this stylist I found"
                    via={Meteor.settings.public.twitterId}
                  >
                    <Button circular color="twitter">
                      Tweet
                    </Button>
                  </TwitterShareButton>
                </li>
              </ul>
              <div className="clearfix" />
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
  favourStylist: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

export default UserProfilePage;
