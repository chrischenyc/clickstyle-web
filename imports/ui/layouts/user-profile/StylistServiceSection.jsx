import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

import StylistServiceSectionItem from './StylistServiceSectionItem';

class StylistServiceSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sectionOpen: true,
    };
  }

  render() {
    const { service, onServiceSelected } = this.props;
    const { sectionOpen } = this.state;

    return (
      <div className="pricing-list-section">
        <a
          href={`./${service.name}#toggle`}
          onClick={(e) => {
            e.preventDefault();
            this.setState({ sectionOpen: !sectionOpen });
          }}
        >
          <div className="pricing-list-section-header">
            <h4>
              {service.name}
              <span>
                {sectionOpen && <i className="fa fa-angle-up" />}
                {!sectionOpen && <i className="fa fa-angle-down" />}
              </span>
            </h4>
          </div>
        </a>

        <Collapse isOpened={sectionOpen}>
          <ul>
            <li>
              <a
                href={`./book/${service.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  onServiceSelected(service);
                }}
              >
                <StylistServiceSectionItem
                  title="Base price"
                  description={service.basePriceDescription}
                  price={service.basePrice}
                />
              </a>
            </li>

            {service.addons &&
              service.addons.map(addon => (
                <li key={addon._id}>
                  <a
                    href={`./book/${addon.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onServiceSelected(service, addon);
                    }}
                  >
                    <StylistServiceSectionItem
                      title={addon.name}
                      description={addon.description}
                      price={addon.price}
                    />
                  </a>
                </li>
              ))}
          </ul>
        </Collapse>
      </div>
    );
  }
}

StylistServiceSection.propTypes = {
  service: PropTypes.object.isRequired,
  onServiceSelected: PropTypes.func.isRequired,
};

export default StylistServiceSection;
