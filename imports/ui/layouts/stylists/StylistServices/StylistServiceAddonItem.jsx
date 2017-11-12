import React from 'react';
import { Input, Grid, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const StylistServiceAddonItem = ({ addon, onRemove }) => (
  <Grid style={{ margin: '0.5rem 0' }}>
    <Grid.Row style={{ paddingTop: '0', paddingBottom: '0' }}>
      <Grid.Column width="9">
        <Input fluid label="Name" type="text" placeholder="add-on name" />
      </Grid.Column>

      <Grid.Column width="6">
        <Input fluid label="Price" type="number" placeholder="add-on price" />
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
        <Input fluid label="Description" type="text" placeholder="optional" />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

StylistServiceAddonItem.propTypes = {
  addon: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default StylistServiceAddonItem;
