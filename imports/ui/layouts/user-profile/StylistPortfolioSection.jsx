import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

import scaledImageURL from '../../../modules/scaled-image-url';

const StylistPortfolioSection = ({ photos }) => {
  // carousel config, disable auto-scroll and arrows if elements are too few
  const slickSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          infinite: photos.length > 1,
          autoplay: photos.length > 1,
          arrows: photos.length > 1,
        },
      },
    ],
  };

  return (
    <Slick {...slickSettings}>
      {photos.map((photo, index) => (
        <div key={index}>
          <div className="profile-header-carousel-image">
            <div
              style={{
                background: `url(${scaledImageURL(photo.url, 'small')})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '50% 50%',
                height: '100%',
              }}
            />
          </div>
        </div>
      ))}
    </Slick>
  );
};

StylistPortfolioSection.propTypes = {
  photos: PropTypes.array.isRequired,
};

export default StylistPortfolioSection;
