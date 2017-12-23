import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Image } from 'semantic-ui-react';

import ScaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import { dayOfWeekAsString } from '../../../modules/format-date';
import OpenHourString from '../../../modules/client/OpenHourString';

const UserProfilePage = ({ user, favourStylist, authenticated }) => {
  if (_.isNil(user)) {
    return <Loading />;
  }

  const { profile, stylist } = user;

  return (
    <div>
      {/* TODO: add stylist portfolio carousal */}

      <div className="container">
        <div className="row sticky-wrapper">
          {/* -- Content -- */}
          <div className="col-lg-8 col-md-8 padding-right-30">
            {/* <!-- Title bar --> */}
            <div id="titlebar" className="listing-titlebar">
              <div className="listing-titlebar-title">
                <Image
                  size="tiny"
                  circular
                  src={ScaledImageURL(
                    profile.photo || Meteor.settings.public.image.defaultProfilePhoto,
                    'tiny',
                  )}
                />
                <h2>{`${profile.name.first} ${profile.name.last}`}</h2>
                <span>
                  <div className="listing-address">
                    <i className="fa fa-map-marker" />
                    &nbsp;{`${profile.address.suburb}, ${profile.address.state}`}
                  </div>
                </span>
              </div>
            </div>

            {/* <!-- Listing Nav --> */}
            <div id="listing-nav" className="listing-nav-container">
              <ul className="listing-nav">
                <li>
                  <a href="#listing-overview" className="active">
                    About
                  </a>
                </li>
                <li>
                  <a href="#listing-pricing-list">Services</a>
                </li>
                <li>
                  <a href="#listing-reviews">Reviews</a>
                </li>
              </ul>
            </div>

            {/* <!-- Overview --> */}
            <div id="listing-overview" className="listing-section">
              <p>{profile.about}</p>
            </div>

            {/* <!-- Services --> */}
            <div id="listing-pricing-list" className="listing-section">
              <h3 className="listing-desc-headline margin-top-70 margin-bottom-30">Services</h3>

              <div className="pricing-list-container">
                {stylist.services &&
                  stylist.services.map(service => (
                    <div key={service._id}>
                      <h4>{service.name}</h4>
                      <ul>
                        <li>
                          <h5>Base price</h5>
                          <p>{service.basePriceDescription}</p>
                          <span>${service.basePrice}</span>
                        </li>
                        {service.addons &&
                          service.addons.map(addon => (
                            <li key={addon._id}>
                              <h5>{addon.name}</h5>
                              <p>{addon.description}</p>
                              <span>${addon.price}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
            {/* <!-- Services / End --> */}

            {/* <!-- Reviews --> */}
            <div id="listing-reviews" className="listing-section">
              <h3 className="listing-desc-headline margin-top-75 margin-bottom-20">
                Reviews
                <span>(12)</span>
              </h3>

              <div className="clearfix" />

              {/* <!-- Reviews --> */}
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
                      <a href="#" className="rate-review">
                        <i className="sl sl-icon-like" /> Helpful Review
                        <span>12</span>
                      </a>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </div>
          {/* -- Content / End -- */}

          {/* <!-- Sidebar --> */}
          <div className="col-lg-4 col-md-4 margin-top-75 sticky">
            {/* <!-- Book Now --> */}
            <div className="boxed-widget booking-widget margin-top-35">
              <h3>
                <i className="fa fa-calendar-check-o " /> Make a booking
              </h3>
              <div className="row with-forms  margin-top-0">
                {/* <!-- Date Picker - docs: http://www.vasterad.com/docs/listeo/#!/date_picker --> */}
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

                {/* <!-- Time Picker - docs: http://www.vasterad.com/docs/listeo/#!/time_picker --> */}
                <div className="col-lg-6 col-md-12">
                  <input type="text" id="booking-time" value="9:00 am" />
                </div>

                {/* TODO: add selected service/addon */}
              </div>

              {/* <!-- progress button animation handled via custom.js --> */}
              <a href="pages-booking.html" className="button book-now fullwidth margin-top-5">
                Book Now
              </a>
            </div>
            {/* <!-- Book Now / End --> */}

            {/* <!-- Opening Hours --> */}
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
            {/* <!-- Opening Hours / End --> */}

            {/* <!-- Share / Like --> */}
            <div className="listing-share margin-top-40 margin-bottom-40 no-border">
              {authenticated && (
                <button className="like-button" onClick={favourStylist}>
                  <span className="like-icon" /> {stylist.favoured ? 'Un-bookmark' : 'Bookmark'}{' '}
                  this stylist
                </button>
              )}
              {stylist.favorites &&
                stylist.favorites > 0 && (
                  <span>{stylist.favorites} people bookmarked this stylist</span>
                )}

              {/* <!-- Share Buttons --> */}
              <ul className="share-buttons margin-top-40 margin-bottom-0">
                <li>
                  <a className="fb-share" href="#">
                    <i className="fa fa-facebook" /> Share
                  </a>
                </li>
                <li>
                  <a className="twitter-share" href="#">
                    <i className="fa fa-twitter" /> Tweet
                  </a>
                </li>
                <li>
                  <a className="gplus-share" href="#">
                    <i className="fa fa-google-plus" /> Share
                  </a>
                </li>
              </ul>
              <div className="clearfix" />
            </div>
          </div>
          {/* <!-- Sidebar / End --> */}
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
