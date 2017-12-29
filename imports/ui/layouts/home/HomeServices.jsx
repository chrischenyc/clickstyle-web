import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Link } from 'react-router-dom';

import scaledImageURL from '../../../modules/scaled-image-url';
import { ServiceNameToSEOName } from '../../../modules/seo-name';
import LoadingBubbles from '../../components/LoadingBubbles';

const HomeServices = ({ services }) => {
  // carousel config, disable auto-scroll and arrows if elements are too few
  const slickSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    arrows: services.length > 5,
    infinite: services.length > 5,
    autoplay: services.length > 5,
    speed: 500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          arrows: services.length > 4,
          infinite: services.length > 4,
          autoplay: services.length > 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: services.length > 1,
          infinite: services.length > 1,
          autoplay: services.length > 1,
        },
      },
    ],
  };

  return (
    <div className="container carousel-container">
      <div className="row">
        <h3 className="headline margin-bottom-10">Services</h3>
      </div>

      <div className="row">
        {services.length === 0 && <LoadingBubbles />}

        {services.length > 0 && (
          <Slick {...slickSettings}>
            {services.map(service => (
              <div key={service._id} className="carousel-item-container">
                <Link
                  to={`/stylists/${ServiceNameToSEOName(service.name)}`}
                  className="category-box"
                >
                  <img
                    src={
                      service.photo
                        ? scaledImageURL(service.photo, 'medium')
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
        )}
      </div>
    </div>
  );
};

HomeServices.propTypes = {
  services: PropTypes.array.isRequired,
};

export default HomeServices;
