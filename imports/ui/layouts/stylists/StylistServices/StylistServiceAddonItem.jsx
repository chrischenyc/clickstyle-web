import React, { Component } from 'react';
import { Input, Search, Button, List } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { NumberField, FormFieldErrorMessage } from '../../../components/FormInputField';
import { withMediaQuery } from '../../../components/HOC';

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
      addon, onRemove, onChange, errors, screenWidth,
    } = this.props;

    return (
      <div>
        <List>
          <List.Item>
            <Search
              fluid={screenWidth < 1024}
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
          </List.Item>

          <List.Item>
            <NumberField
              fluid={screenWidth < 1024}
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
          </List.Item>

          <List.Item>
            <NumberField
              fluid={screenWidth < 1024}
              name="duration"
              label="Duration (mins)"
              placeholder="how long will this add-on take?"
              value={addon.duration}
              onChange={onChange}
            />

            <FormFieldErrorMessage
              compact
              message={errors.duration}
              style={{ marginTop: '0.2rem' }}
            />
          </List.Item>

          <List.Item>
            <Input
              fluid
              name="description"
              label="Description"
              type="text"
              placeholder="what is this addon about (optional)"
              maxLength="200"
              value={addon.description}
              onChange={onChange}
            />
          </List.Item>

          <List.Item>
            <Button
              style={{ float: 'right' }}
              circular
              basic
              type="button"
              negative
              onClick={() => {
                onRemove();
              }}
            >
              Delete
            </Button>
          </List.Item>
        </List>
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
  screenWidth: PropTypes.number.isRequired,
};

export default withMediaQuery(StylistServiceAddonItem);
