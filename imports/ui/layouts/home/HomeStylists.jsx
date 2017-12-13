import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Link } from 'react-router-dom';

import scaledImageURL from '../../../modules/scaled-image-url';
import { ServiceNameToSEOName } from '../../../modules/seo-name';

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

const HomeServices = ({ stylists }) => (
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
              className="category-box"
              style={{ margin: '0 2px', borderRadius: '0' }}
              key={stylist.owner}
            >
              <img
                src={
                  stylist.profile.photo
                    ? scaledImageURL(stylist.profile.photo, 'small')
                    : 'images/service-placeholder.jpg'
                }
                alt={stylist.profile.name}
              />
              <div className="category-box-content">
                <h3>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</h3>
              </div>
            </Link>
          ))}
        </Slick>
      </div>
    </div>
  </div>
);

HomeServices.propTypes = {
  stylists: PropTypes.array.isRequired,
};

export default HomeServices;
