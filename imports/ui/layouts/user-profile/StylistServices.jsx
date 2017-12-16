import React from 'react';
import PropTypes from 'prop-types';
import scaledImageURL from '../../../modules/scaled-image-url';

const StylistServices = ({ services }) => (
  <div className="row">
    {services.map((service) => {
      // TODO: placeholder image
      const photo = service.photo
        ? scaledImageURL(service.photo, 'small')
        : '/images/placeholder-square.jpg';

      return (
        <div className="col-lg-12 col-md-12" key={service._id}>
          <div className="listing-item-container list-layout">
            <a href="listings-single-page.html" className="listing-item">
              <div className="listing-item-image">
                <img src={photo} alt="" />
                <span className="tag">{service.name}</span>
              </div>

              <div className="listing-item-content">
                <div className="listing-item-inner">
                  <h3>Base price: {service.basePrice}</h3>
                  {service.basePriceDescription && <span>{service.basePriceDescription}</span>}

                  {service.addons &&
                    service.addons.map(addon => (
                      <div key={addon._id}>
                        <h4>{`${addon.name} ${addon.price}`}</h4>
                        {addon.description && <span>{addon.description}</span>}
                      </div>
                    ))}
                </div>
              </div>
            </a>
          </div>
        </div>
      );
    })}
  </div>
);

StylistServices.propTypes = {
  services: PropTypes.array.isRequried,
};

export default StylistServices;
