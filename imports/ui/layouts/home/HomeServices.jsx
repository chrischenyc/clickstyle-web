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
      <div className="col-md-12">
        <h3 className="headline margin-bottom-35">
          Services
          <span>Browse stylists by service categories</span>
        </h3>
      </div>
    </div>

    <div className="row">
      <div>
        <Slick {...slickSettings}>
          {services.map(service => (
            <Link
              to={`/stylists/${ServiceNameToSEOName(service.name)}`}
              className="category-box"
              style={{ margin: '0 2px', borderRadius: '0' }}
              key={service._id}
            >
              <img
                src={
                  service.photo
                    ? scaledImageURL(service.photo, 'small')
                    : 'images/service-placeholder.jpg'
                }
                alt={service.name}
              />
              <div className="category-box-content">
                <h3>{service.name}</h3>
              </div>
            </Link>
          ))}
        </Slick>
      </div>
    </div>
  </div>
);

HomeServices.propTypes = {
  services: PropTypes.array.isRequired,
};

export default HomeServices;
