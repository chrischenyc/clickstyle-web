import React from 'react';
import Slick from 'react-slick';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

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
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
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

const HomeServices = () => (
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
          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>

          <div className="category-box-container" style={{ margin: '0 2px' }}>
            <Link to="/stylists/makeup" className="category-box">
              <img src="images/category-box-03.jpg" alt="makeup" />
              <div className="category-box-content">
                <h3>Makeup</h3>
              </div>
              <span className="category-box-btn">Browse</span>
            </Link>
          </div>
        </Slick>
      </div>
    </div>
  </div>
);

export default HomeServices;
