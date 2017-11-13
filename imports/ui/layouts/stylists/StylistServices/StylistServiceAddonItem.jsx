import React from 'react';
import { Input, Grid, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { PriceField } from '../../../components/FormInputField';

const StylistServiceAddonItem = ({ addon, onRemove, onChange }) => (
  <Grid style={{ margin: '0.5rem 0' }}>
    <Grid.Row style={{ paddingTop: '0', paddingBottom: '0' }}>
      <Grid.Column width="9">
        <Input
          fluid
          name="name"
          label="Name"
          type="text"
          placeholder="add-on name"
          value={addon.name}
          onChange={onChange}
        />
      </Grid.Column>

      <Grid.Column width="6">
        <PriceField
          fluid
          name="price"
          label="Price"
          placeholder="add-on price"
          value={addon.price}
          onChange={onChange}
        />
      </Grid.Column>

      <Grid.Column width="1">
        <Button
          basic
          type="button"
          icon="delete"
          onClick={() => {
            onRemove();
          }}
        />
      </Grid.Column>
    </Grid.Row>

    <Grid.Row style={{ paddingTop: '0.2rem', paddingBottom: '0' }}>
      <Grid.Column width="15">
        <Input
          fluid
          name="description"
          label="Description"
          type="text"
          placeholder="optional"
          value={addon.description}
          onChange={onChange}
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

StylistServiceAddonItem.propTypes = {
  addon: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StylistServiceAddonItem;
