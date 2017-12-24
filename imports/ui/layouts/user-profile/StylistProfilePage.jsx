import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { ShareButtons } from 'react-share';
import { Collapse } from 'react-collapse';

import userNameWithGreeting from '../../../modules/client/user-name-with-greeting';
import ScaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import { dayOfWeekAsString, formatMonthYear } from '../../../modules/format-date';
import OpenHourString from '../../../modules/client/OpenHourString';
import StylistServiceSection from './StylistServiceSection';

const { FacebookShareButton, TwitterShareButton } = ShareButtons;

const UserProfilePage = ({ user, favourStylist, authenticated }) => {
  if (_.isNil(user)) {
    return <Loading />;
  }

  const { profile, stylist } = user;

  return (
    <div>
      {/* TODO: add stylist portfolio carousal */}

      <div className="profile-header">
        <div className="profile-header-bg" />

        <div className="profile-header-avatar">
          <img
            alt=""
            src={ScaledImageURL(
              profile.photo || Meteor.settings.public.image.defaultProfilePhoto,
              'tiny',
            )}
          />
        </div>

        <div className="profile-header-info">
          <h2 className="title">{userNameWithGreeting(profile.name)}</h2>

          <div className="desc">
            {profile.address.suburb && `${profile.address.suburb}, ${profile.address.state}`}
            {profile.address.suburb &&
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

            {/* -- Reviews -- */}
            <div id="stylist-profile-reviews" className="listing-section margin-bottom-50">
              <h3 className="listing-desc-headline">
                Reviews&nbsp;<span>(12)</span>
              </h3>

              {/* -- Reviews -- */}
              <section className="comments listing-reviews">
                <ul>
                  <li>
                    <div className="avatar">
                      <img
                        src="http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70"
                        alt=""
                      />
                    </div>
                    <div className="comment-content">
                      <div className="arrow-comment" />
                      <div className="comment-by">
                        Kathy Brown
                        <span className="date">June 2017</span>
                        <div className="star-rating" data-rating="5" />
                      </div>
                      <p>
                        Morbi velit eros, sagittis in facilisis non, rhoncus et erat. Nam posuere
                        tristique sem, eu ultricies tortor imperdiet vitae. Curabitur lacinia neque
                        non metus
                      </p>

                      <div className="review-images mfp-gallery-container">
                        <a href="images/review-image-01.jpg" className="mfp-gallery">
                          <img src="images/review-image-01.jpg" alt="" />
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
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
              <a href="pages-booking.html" className="button book-now fullwidth margin-top-5">
                Book Now
              </a>
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
            <div className="listing-share margin-top-40 margin-bottom-35 no-border">
              {authenticated && (
                <button className="like-button" onClick={favourStylist}>
                  <span className="like-icon" /> {stylist.favoured ? 'Un-favourite' : 'Favourite'}&nbsp;this
                  stylist
                </button>
              )}
              {stylist.favourites > 0 && <span>{stylist.favourites} favourites</span>}

              {/* -- Share Buttons -- */}
              <ul className="share-buttons margin-top-20 margin-bottom-0">
                <li>
                  <FacebookShareButton
                    url={window.location.href}
                    quote={`check this stylist I found on @${Meteor.settings.public.facebookId}`}
                  >
                    <a className="fb-share" href="./share-facebook">
                      <i className="fa fa-facebook" /> Share
                    </a>
                  </FacebookShareButton>
                </li>
                <li>
                  <TwitterShareButton
                    url={window.location.href}
                    title="check this stylist I found"
                    via={Meteor.settings.public.twitterId}
                  >
                    <a className="twitter-share" href="./share-twitter">
                      <i className="fa fa-twitter" /> Tweet
                    </a>
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
