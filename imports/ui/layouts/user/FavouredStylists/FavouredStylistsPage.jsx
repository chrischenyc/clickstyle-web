import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Container } from 'semantic-ui-react';

import scaledImageURL from '../../../../modules/scaled-image-url';
import userProfileLink from '../../../../modules/user-profile-link';

const FavouredStylistsPage = ({ stylists, unFavourStylist }) => (
  <Container text>
    <div className="row">
      <div className="col-lg-12 col-md-12">
        <div className="dashboard-list-box margin-top-0">
          <h4>Favoured Stylists</h4>
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
        </div>
      </div>
    </div>
  </Container>
);

FavouredStylistsPage.propTypes = {
  stylists: PropTypes.array.isRequired,
  unFavourStylist: PropTypes.func.isRequired,
};

export default FavouredStylistsPage;
