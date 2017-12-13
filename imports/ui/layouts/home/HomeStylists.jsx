import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Link } from 'react-router-dom';

import scaledImageURL from '../../../modules/scaled-image-url';

const slickSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const HomeStylists = ({ stylists }) => (
  <div className="container" style={{ margin: '8rem auto' }}>
    <div className="row">
      <div className="col-md-12">
        <h3 className="headline margin-bottom-35">
          Stylists
          <span>Browse stylists nearby</span>
        </h3>
      </div>
    </div>

    <div className="row">
      <div>
        <Slick {...slickSettings}>
          {stylists.map(stylist => (
            <Link
              to={`/stylists/${stylist.owner}`}
              className="listing-item-container"
              style={{ margin: '0 2px' }}
              key={stylist.owner}
            >
              <div className="listing-item">
                <img
                  src={
                    stylist.profile.photo
                      ? scaledImageURL(stylist.profile.photo, 'small')
                      : 'images/service-placeholder.jpg'
                  }
                  alt={stylist.profile.name}
                />

                <div className="listing-item-content">
                  <h3>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</h3>

                  {stylist.services &&
                    stylist.services.length && (
                      <span style={{ fontSize: '1em' }}>
                        {stylist.services.map(service => service.name).join(', ')}
                      </span>
                    )}
                </div>
              </div>
            </Link>
          ))}
        </Slick>
      </div>
    </div>
  </div>
);

HomeStylists.propTypes = {
  stylists: PropTypes.array.isRequired,
};

export default HomeStylists;
