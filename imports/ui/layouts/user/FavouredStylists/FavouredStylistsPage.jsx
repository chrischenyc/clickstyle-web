import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';

import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';

const FavouredStylistsPage = ({ stylists, unFavourStylist }) => (
  <Container>
    <div className="dashboard-list-box">
      <h4>Favourite Stylists</h4>

      {stylists.length > 0 && (
        <ul>
          {stylists.map(stylist => (
            <li key={stylist.owner}>
              <div className="list-box-listing">
                <Link target="_blank" to={userProfileLink(stylist)}>
                  <div className="medium-avatar">
                    <img
                      src={scaledImageURL(
                        stylist.photo || Meteor.settings.public.defaultAvatar,
                        'small',
                      )}
                      alt=""
                    />
                  </div>
                </Link>

                <div className="list-box-listing-content">
                  <div className="inner">
                    <h3>{`${stylist.name.first} ${stylist.name.last}`}</h3>
                    <span>
                      {stylist.address.suburb &&
                        `${stylist.address.suburb}, ${stylist.address.state}`}
                      <br />
                      {stylist.services.map(service => service.name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="buttons-to-right">
                <Button
                  circular
                  negative
                  onClick={(e) => {
                    e.preventDefault();
                    unFavourStylist(stylist.owner);
                  }}
                >
                  Un-favourite
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {stylists.length === 0 && (
        <ul>
          <li>
            You haven&apos;t found your favourite stylist yet.{' '}
            <Link to="/search">Find one today!</Link>
          </li>
        </ul>
      )}
    </div>
  </Container>
);

FavouredStylistsPage.propTypes = {
  stylists: PropTypes.array.isRequired,
  unFavourStylist: PropTypes.func.isRequired,
};

export default FavouredStylistsPage;
