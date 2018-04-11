import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'semantic-ui-react';

import formatPrice from '../../../modules/format-price';

const StylistServiceSectionItem = ({
  title, duration, description, price,
}) => (
  <div className="pricing-list-section-item">
    <div className="col-lg-9 col-md-8 col-sm-7 col-xs-7">
      <h5>{title}</h5>
      {duration && <p>{`${duration} mins`}</p>}
      {!_.isEmpty(description) && <p>{description}</p>}
    </div>
    <div className="col-lg-3 col-md-4 col-sm-5 col-xs-5 padding-left-0 padding-right-0">
      <div className="price-list-section-item-price">
        {formatPrice(price)}
        <Button type="button" color="teal" size="small" style={{ marginLeft: '1rem' }}>
          Add
        </Button>
      </div>
      <div className="clearfix" />
    </div>
  </div>
);

StylistServiceSectionItem.defaultProps = {
  description: '',
};

StylistServiceSectionItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  price: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

export default StylistServiceSectionItem;
