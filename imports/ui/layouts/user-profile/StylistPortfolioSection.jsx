import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import Lightbox from 'react-images';

import scaledImageURL from '../../../modules/scaled-image-url';

class StylistPortfolioSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openLightbox: false,
      lightboxIndex: 0,
    };
  }

  render() {
    const { photos } = this.props;

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
      <div>
        <Slick {...slickSettings}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className="profile-header-carousel-image"
              onClick={() => {
                this.setState({
                  openLightbox: true,
                  lightboxIndex: index,
                });
              }}
            >
              <div
                style={{
                  background: `url(${scaledImageURL(photo.url, 'medium')})`,
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '50% 50%',
                  height: '100%',
                }}
              />
            </div>
          ))}
        </Slick>

        <Lightbox
          images={photos.map(photo => ({ src: scaledImageURL(photo.url, 'large') }))}
          isOpen={this.state.openLightbox}
          currentImage={this.state.lightboxIndex}
          style={{ zIndex: '1000' }}
          backdropClosesModal
          showImageCount={false}
          onClickPrev={() => {
            this.setState({ lightboxIndex: Math.max(0, this.state.lightboxIndex - 1) });
          }}
          onClickNext={() => {
            this.setState({
              lightboxIndex: Math.min(photos.length - 1, this.state.lightboxIndex + 1),
            });
          }}
          onClose={() => {
            this.setState({ openLightbox: false });
          }}
        />
      </div>
    );
  }
}

StylistPortfolioSection.propTypes = {
  photos: PropTypes.array.isRequired,
};

export default StylistPortfolioSection;
