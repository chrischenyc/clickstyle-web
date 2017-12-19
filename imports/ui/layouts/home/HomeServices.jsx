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

const HomeServices = ({ services }) => (
  <div className="container" style={{ margin: '8rem auto' }}>
    <div className="row">
      <h3 className="headline margin-bottom-35">Services</h3>
    </div>

    <div className="row">
      <Slick {...slickSettings}>
        {services.map(service => (
          <div key={service._id} style={{ padding: '0 4px' }}>
            <Link to={`/stylists/${ServiceNameToSEOName(service.name)}`} className="category-box">
              <img
                src={
                  service.photo
                    ? scaledImageURL(service.photo, 'small')
                    : '/images/placeholder-square.jpg'
                }
                alt={service.name}
              />
              <div className="category-box-content">
                <h3>{service.name}</h3>
              </div>
            </Link>
          </div>
        ))}
      </Slick>
    </div>
  </div>
);

HomeServices.propTypes = {
  services: PropTypes.array.isRequired,
};

export default HomeServices;
