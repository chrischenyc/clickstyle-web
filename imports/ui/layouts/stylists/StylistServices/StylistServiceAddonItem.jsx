import React from 'react';
import { Input, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StylistServiceAddonItem = ({ addon }) => (
  <div>
    Price:&nbsp;&nbsp;
    <Input labelPosition="right" type="text" placeholder="Amount">
      <Label basic>$</Label>
      <input type="number" />
      <Label>.00</Label>
    </Input>
  </div>
);

StylistServiceAddonItem.propTypes = {
  addon: PropTypes.object.isRequired,
};

export default StylistServiceAddonItem;
