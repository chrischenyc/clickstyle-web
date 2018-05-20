import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { deleteService, deleteAddon } from '../../modules/client/redux/cart';
import formatPrice from '../../modules/format-price';
import { calculateTotalDuration } from '../../modules/cart-calculator';

const CartSummary = props => (
  <ul>
    <li style={{ marginBottom: '1em' }}>
      Est. duration<span>{`${calculateTotalDuration(props.cart.services)} mins`}</span>
    </li>

    {props.cart.services.map(service => (
      <li key={service._id}>
        <i
          className="fa fa-minus delete"
          onClick={() => {
            props.deleteService(service);
          }}
        />

        {service.name}
        <span>{formatPrice(service.basePrice)}</span>

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
              <span>{formatPrice(addon.price)}</span>
            </li>
          ))}
        </ul>
      </li>
    ))}

    {props.cart.couponDiscount > 0 && (
      <li>
        Discount<span>{formatPrice(-props.cart.couponDiscount)}</span>
      </li>
    )}

    {props.cart.total > 0 && (
      <li className="total-cost">
        Total<span>{formatPrice(Math.max(props.cart.total - props.cart.couponDiscount, 0))}</span>
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
