import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import LoadingBubbles from '../../components/LoadingBubbles';

import HomeStylistsItem from './HomeStylistsItem';

const HomeStylists = (props) => {
  const { stylists, locationBased } = props;

  // carousel config, disable auto-scroll and arrows if elements are too few
  const slickSettings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    arrows: stylists.length > 4,
    infinite: stylists.length > 4,
    autoplay: false,
    speed: 500,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          arrows: stylists.length > 3,
          infinite: stylists.length > 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          arrows: stylists.length > 1,
          infinite: stylists.length > 1,
        },
      },
    ],
  };

  return (
    <div className="container carousel-container">
      <div className="row">
        <h3 className="headline margin-bottom-10">
          {!locationBased && 'Stylists'}
          {locationBased && 'Stylists near by'}
        </h3>
      </div>

      <div className="row">
        {stylists.length === 0 && <LoadingBubbles />}

        {stylists.length > 0 && (
          <Slick {...slickSettings}>
            {stylists.map(stylist => (
              <div key={stylist.owner} className="carousel-item-container">
                <HomeStylistsItem stylist={stylist} />
              </div>
            ))}
          </Slick>
        )}
      </div>
    </div>
  );
};

HomeStylists.propTypes = {
  stylists: PropTypes.array.isRequired,
  locationBased: PropTypes.bool.isRequired,
};

export default HomeStylists;
