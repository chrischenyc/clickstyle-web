import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import ScaledImageURL from '../../../../modules/scaled-image-url';

const FavouredStylistsPage = ({ stylists, unFavourStylist }) => (
  <div className="container">
    <div className="row">
      <div className="col-lg-12 col-md-12">
        <div className="dashboard-list-box margin-top-0">
          <h4>Favoured Stylists</h4>
          <ul>
            {stylists.map(stylist => (
              <li key={stylist.owner}>
                <div className="list-box-listing">
                  <div className="list-box-listing-img">
                    <Link
                      to={`/users/show/${
                        stylist.owner
                      }/${stylist.profile.name.first.toLowerCase()}${stylist.profile.name.last.toLowerCase()}`}
                    >
                      <Image
                        size="tiny"
                        circular
                        src={ScaledImageURL(
                          stylist.profile.photo || Meteor.settings.public.image.defaultProfilePhoto,
                          'tiny',
                        )}
                      />
                    </Link>
                  </div>
                  <div className="list-box-listing-content">
                    <div className="inner">
                      <h3>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</h3>
                      <span>
                        {stylist.profile.address.suburb &&
                          `${stylist.profile.address.suburb}, ${stylist.profile.address.state}`}
                        <br />
                        {stylist.services.map(service => service.name).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="buttons-to-right">
                  <a
                    href={`./un-favour/${stylist.owner}`}
                    className="button gray"
                    onClick={(e) => {
                      e.preventDefault();
                      unFavourStylist(stylist.owner);
                    }}
                  >
                    <i className="sl sl-icon-close" /> Delete
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

FavouredStylistsPage.propTypes = {
  stylists: PropTypes.array.isRequired,
  unFavourStylist: PropTypes.func.isRequired,
};

export default FavouredStylistsPage;
