import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { deleteService, deleteAddon } from '../../../modules/client/redux/cart';

const StylistBookingSection = props => (
  <div className="booking">
    <h3>
      <i className="fa fa-calendar-check-o " /> Make a booking
    </h3>

    <div className="row">
      {/* -- Date Picker - docs: http://www.vasterad.com/docs/listeo/#!/date_picker -- */}
      <div className="col-lg-6 col-md-12">
        <input type="text" id="booking-date" />
      </div>

      {/* -- Time Picker - docs: http://www.vasterad.com/docs/listeo/#!/time_picker -- */}
      <div className="col-lg-6 col-md-12">
        <input type="text" id="booking-time" />
      </div>
    </div>

    <div className="row">
      <ul>
        {props.cart.services.map(service => (
          <li key={service._id}>
            <i
              className="fa fa-minus delete"
              onClick={() => {
                props.deleteService(service);
              }}
            />

            {service.name}
            <span>{`$${service.basePrice}`}</span>
            <ul>
              {service.addons.map(addon => (
                <li key={addon._id}>
                  <i
                    className="fa fa-minus delete"
                    onClick={() => {
                      props.deleteAddon(service, addon);
                    }}
                  />

                  {addon.name}
                  <span>{`$${addon.price}`}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}

        {props.cart.total > 0 && (
          <li className="total-cost">
            Total<span>${props.cart.total}</span>
          </li>
        )}
      </ul>
    </div>

    {/* -- progress button animation handled via custom.js -- */}
    <Button circular size="huge" fluid color="teal" className="margin-top-25">
      Book Now
    </Button>
  </div>
);

StylistBookingSection.propTypes = {
  deleteService: PropTypes.func.isRequired,
  deleteAddon: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { deleteService, deleteAddon })(StylistBookingSection);
