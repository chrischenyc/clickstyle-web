import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { deleteService, deleteAddon } from '../../modules/client/redux/cart';

const CartSummary = props => (
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
);

CartSummary.propTypes = {
  deleteService: PropTypes.func.isRequired,
  deleteAddon: PropTypes.func.isRequired,
  cart: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { deleteService, deleteAddon })(CartSummary);
