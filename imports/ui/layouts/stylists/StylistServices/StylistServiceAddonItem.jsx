import React from 'react';
import { Input, Grid, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
        <Input
          fluid
          name="price"
          label="Price"
          type="number"
          placeholder="add-on price"
          min="1"
          value={addon.price}
          onChange={onChange}
          onBlur={(event) => {
            const price = parseInt(event.target.value);
            if (price <= 0) {
              onChange({ target: { name: event.target.name, value: '' } });
            }
          }}
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
