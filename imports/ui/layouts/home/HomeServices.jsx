import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

import scaledImageURL from '../../../modules/scaled-image-url';
import { ServiceNameToSEOName } from '../../../modules/seo-name';

const PrevArrow = () => <Button basic circular icon="chevron left" color="teal" />;
const NextArrow = () => <Button basic circular icon="chevron right" color="teal" />;

const slickSettings = {
  dots: false,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
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
  <div>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h3 className="headline margin-bottom-35 margin-top-70">
            Services
            <span>Browse stylists by service categories</span>
          </h3>
        </div>
      </div>

      <div className="row">
        <Slick {...slickSettings}>
          {services.map(service => (
            <Link
              to={`/stylists/${ServiceNameToSEOName(service.name)}`}
              className="category-box"
              style={{ margin: '0 2px' }}
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
