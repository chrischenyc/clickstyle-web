import React from 'react';
import { Input, Grid, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { PriceField, FormFieldErrorMessage } from '../../../components/FormInputField';

const StylistServiceAddonItem = ({
  addon, onRemove, onChange, errors,
}) => (
  <Grid style={{ margin: '0.5rem 0' }}>
    <Grid.Row style={{ paddingTop: '0', paddingBottom: '0' }}>
      <Grid.Column width="9">
        <Input
          fluid
          name="name"
          label="Name"
          type="text"
          placeholder="add-on name"
          maxLength="100"
          value={addon.name}
          onChange={onChange}
        />

        <div>
          <FormFieldErrorMessage
            compact
            message={errors.name}
            style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}
          />
        </div>
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

        <div>
          <FormFieldErrorMessage
            compact
            message={errors.price}
            style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}
          />
        </div>
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

    <Grid.Row style={{ paddingTop: '0.25rem' }}>
      <Grid.Column width="15">
        <Input
          fluid
          name="description"
          label="Description"
          type="text"
          placeholder="optional"
          maxLength="200"
          value={addon.description}
          onChange={onChange}
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

StylistServiceAddonItem.defaultProps = {
  errors: {},
};

StylistServiceAddonItem.propTypes = {
  addon: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default StylistServiceAddonItem;
