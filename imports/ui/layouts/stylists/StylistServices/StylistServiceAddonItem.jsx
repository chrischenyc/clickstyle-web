import React, { Component } from 'react';
import { Input, Grid, Button, Responsive, Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { PriceField, FormFieldErrorMessage } from '../../../components/FormInputField';

class StylistServiceAddonItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
  }

  handleResultSelect(e, { result }) {
    this.props.onChange({ target: { name: 'name', value: result.title } });
  }

  handleSearchChange(e) {
    this.props.onChange(e);

    const keyword = e.target.value;

    if (keyword < 1) {
      this.setState({ results: [] });
      return;
    }

    this.setState({
      results: this.props.publicAddons
        .map(addon => ({ title: addon.name }))
        .filter(addon => addon.title.toLowerCase().indexOf(keyword.toLowerCase()) >= 0),
    });
  }

  render() {
    const {
      publicAddons, addon, onRemove, onChange, errors,
    } = this.props;

    return (
      <div>
        <Responsive
          minWidth={Responsive.onlyTablet.minWidth}
          style={{ margin: '0.5rem 0.5rem 0.5rem 0' }}
        >
          <Grid>
            <Grid.Row style={{ paddingTop: '0', paddingBottom: '0' }}>
              <Grid.Column width="9">
                <Search
                  fluid
                  input={{ fluid: true, label: 'Name' }}
                  name="name"
                  placeholder="add-on name"
                  maxLength="100"
                  noResultsMessage="no matched add-on name"
                  noResultsDescription="but that's totally alright, keep typing and name your own add-on"
                  value={addon.name}
                  onFocus={this.handleSearchChange}
                  onSearchChange={this.handleSearchChange}
                  onResultSelect={this.handleResultSelect}
                  results={this.state.results}
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
        </Responsive>

        <Responsive maxWidth={Responsive.onlyMobile.maxWidth} style={{ margin: '0.5rem 0' }}>
          <Input
            fluid
            name="name"
            label="Name"
            type="text"
            placeholder="add-on name"
            maxLength="100"
            style={{ marginBottom: '0.25rem' }}
            value={addon.name}
            onChange={onChange}
          />
          <FormFieldErrorMessage
            compact
            message={errors.name}
            style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}
          />

          <PriceField
            fluid
            name="price"
            label="Price"
            placeholder="add-on price"
            style={{ marginBottom: '0.25rem' }}
            value={addon.price}
            onChange={onChange}
          />
          <FormFieldErrorMessage
            compact
            message={errors.price}
            style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}
          />

          <Input
            fluid
            name="description"
            label="Description"
            type="text"
            placeholder="optional"
            maxLength="200"
            style={{ marginBottom: '0.25rem' }}
            value={addon.description}
            onChange={onChange}
          />

          <Button
            basic
            fluid
            type="button"
            content="Remove add-on"
            icon="delete"
            labelPosition="right"
            onClick={() => {
              onRemove();
            }}
          />
        </Responsive>
      </div>
    );
  }
}

StylistServiceAddonItem.defaultProps = {
  errors: {},
};

StylistServiceAddonItem.propTypes = {
  addon: PropTypes.object.isRequired,
  publicAddons: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default StylistServiceAddonItem;
