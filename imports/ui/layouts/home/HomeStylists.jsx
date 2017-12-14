import React from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

import HomeStylistsItem from './HomeStylistsItem';

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
      <h3 className="headline margin-bottom-35">
        Stylists
        <span>Browse stylists nearby</span>
      </h3>
    </div>

    <div className="row">
      <Slick {...slickSettings}>
        {stylists.map(stylist => (
          <div key={stylist.owner}>
            <HomeStylistsItem stylist={stylist} />
          </div>
        ))}
      </Slick>
    </div>
  </div>
);

HomeStylists.propTypes = {
  stylists: PropTypes.array.isRequired,
};

export default HomeStylists;
