import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Responsive, Rating } from 'semantic-ui-react';
import classNames from 'classnames';
import { connect } from 'react-redux';

import userNameWithGreeting from '../../../modules/client/user-name-with-greeting';
import scaledImageURL from '../../../modules/scaled-image-url';
import Loading from '../../components/Loading';
import { monthYearString } from '../../../modules/format-date';
import { withMediaQuery } from '../../components/HOC';

import StylistServiceSection from './StylistServiceSection';
import StylistReviewsSection from './StylistReviewsSection';
import StylistPortfolioSection from './StylistPortfolioSection';
import StylistBookingSection from './StylistBookingSection';
import StylistHoursSection from './StylistHoursSection';
import StylistShareSection from './StylistShareSection';

const StylistProfilePage = (props) => {
  if (_.isNil(props.user)) {
    return <Loading />;
  }

  const { profile, stylist } = props.user;

  return (
    <Fragment>
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

            {stylist.reviewsCount &&
              stylist.averageRating && (
                <div>
                  <Rating
                    icon="star"
                    maxRating={5}
                    defaultRating={stylist.averageRating}
                    disabled
                  />
                  {` (${stylist.reviewsCount} reviews)`}
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="margin-top-50 margin-bottom-50">
          {/* -- Content -- */}
          <div
            className={classNames({
              'col-lg-8 col-md-8 padding-right-30': props.screenWidth > 1024,
              'col-12': props.screenWidth <= 1024,
            })}
          >
            {/* -- About, Products -- */}
            {(!_.isEmpty(profile.about) || !_.isEmpty(profile.products)) && (
              <div id="stylist-profile-overview" className="listing-section margin-bottom-35">
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
            <div id="stylist-profile-pricing-list" className="listing-section margin-bottom-35">
              <h3 className="listing-desc-headline">Services</h3>

              <div className="pricing-list-container">
                {stylist.services &&
                  stylist.services.map(service => (
                    <StylistServiceSection
                      key={service._id}
                      service={service}
                      onServiceSelected={props.onServiceSelected}
                    />
                  ))}
              </div>
            </div>

            <Responsive maxWidth={1024} className="margin-bottom-35">
              {/* -- Share / Like -- */}
              <StylistShareSection
                stylist={props.user.stylist}
                userId={props.userId}
                authenticated={props.authenticated}
                favourStylist={props.favourStylist}
              />
            </Responsive>

            {/* -- Reviews -- */}
            {stylist.reviews &&
              stylist.reviews.length > 0 && <StylistReviewsSection reviews={stylist.reviews} />}
          </div>

          {/* -- Sidebar for desktop version -- */}
          <Responsive minWidth={1025} className="col-lg-4 col-md-4">
            {/* only display book section if stylist is not current user */}
            {(_.isNil(props.userId) || props.userId !== stylist.owner) && (
              <div className="boxed-widget booking-widget">
                <StylistBookingSection onBook={props.onBook} />
              </div>
            )}

            {/* -- Opening Hours -- */}
            <div
              className={classNames({
                'margin-top-35': _.isNil(props.userId) || props.userId !== stylist.owner,
              })}
            >
              {stylist.openHours && <StylistHoursSection openHours={stylist.openHours} />}
            </div>

            {/* -- Share / Like -- */}
            <div className="margin-top-35 margin-bottom-35">
              <StylistShareSection
                stylist={props.user.stylist}
                userId={props.userId}
                authenticated={props.authenticated}
                favourStylist={props.favourStylist}
              />
            </div>
          </Responsive>
        </div>
      </div>
    </Fragment>
  );
};

StylistProfilePage.defaultProps = {
  user: null,
  userId: null,
};

StylistProfilePage.propTypes = {
  user: PropTypes.object,
  favourStylist: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  onServiceSelected: PropTypes.func.isRequired,
  onBook: PropTypes.func.isRequired,
  screenWidth: PropTypes.number.isRequired,
  cart: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
});

export default connect(mapStateToProps)(withMediaQuery(StylistProfilePage));
