import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import {
  Segment,
  Message,
  Confirm,
  List,
  Divider,
  Button,
  Responsive,
  Input,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuid from 'uuid/v1';

import StylistServiceAddonItem from './StylistServiceAddonItem';
import { PriceField, FormFieldErrorMessage } from '../../../components/FormInputField';

const normalizeService = (service) => {
  const cloneService = _.cloneDeep(service);

  cloneService.basePrice = cloneService.basePrice || '';
  cloneService.addons = cloneService.addons || [];

  return cloneService;
};

class StylistServiceItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteServiceConfirm: false,
      service: normalizeService(props.service),
    };

    this.handleAddAddon = this.handleAddAddon.bind(this);
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this);
    this.handleChangeAddon = this.handleChangeAddon.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      service: normalizeService(nextProps.service),
    });
  }

  handleAddAddon() {
    const newAddon = {
      _id: uuid(),
      name: '',
      price: '',
      description: '',
    };

    const { service } = this.state;
    const newService = { ...service, addons: [...service.addons, newAddon] };
    this.setState({
      service: newService,
    });

    this.props.onChange(newService);
  }

  handleRemoveAddon(addonToRemove) {
    const { service } = this.state;

    const newService = {
      ...service,
      addons: service.addons.filter(addon => addon._id !== addonToRemove._id),
    };
    this.setState({
      service: newService,
    });

    this.props.onChange(newService);
  }

  handleChangeAddon(addonToChange, event) {
    const { service } = this.state;
    const newService = {
      ...service,
      addons: service.addons.map((addon) => {
        if (addon._id === addonToChange._id) {
          const updatedAddon = { ...addonToChange };

          updatedAddon[event.target.name] = event.target.value;

          return updatedAddon;
        }
        return addon;
      }),
    };

    this.setState({
      service: newService,
    });

    this.props.onChange(newService);
  }

  handleChange(event) {
    const service = { ...this.state.service };
    service[event.target.name] = event.target.value;
    this.setState({ service });

    this.props.onChange(service);
  }

  render() {
    const { service } = this.state;
    const { onDelete, errors } = this.props;

    return (
      <div style={{ padding: '1rem 0' }}>
        <Message
          style={{ background: '#E0F2F1' }}
          attached
          header={service.name}
          info
          onDismiss={() => {
            this.setState({ showDeleteServiceConfirm: true });
          }}
        />

        <Segment attached>
          <List>
            <List.Item>
              <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <PriceField
                  name="basePrice"
                  label="Base price"
                  placeholder="base price"
                  value={service.basePrice}
                  onChange={this.handleChange}
                />
              </Responsive>
              <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                <PriceField
                  fluid
                  name="basePrice"
                  label="Base price"
                  placeholder="base price"
                  value={service.basePrice}
                  onChange={this.handleChange}
                />
              </Responsive>

              <div>
                <FormFieldErrorMessage
                  compact
                  message={errors.basePrice}
                  style={{ marginTop: '0.2rem' }}
                />
              </div>

              <Input
                fluid
                name="basePriceDescription"
                label="Description"
                placeholder="what does the base price includes (optional)"
                type="text"
                maxLength="200"
                style={{ marginTop: '0.2rem', marginBottom: '0.25rem' }}
                value={service.basePriceDescription}
                onChange={this.handleChange}
              />
            </List.Item>

            <List.Item>
              <Divider horizontal>Add-ons</Divider>
            </List.Item>

            {service.addons &&
              service.addons.map(addon => (
                <List.Item key={addon._id}>
                  <StylistServiceAddonItem
                    addon={addon}
                    publicAddons={service.publicAddons}
                    onRemove={() => {
                      this.handleRemoveAddon(addon);
                    }}
                    onChange={(event) => {
                      this.handleChangeAddon(addon, event);
                    }}
                    errors={errors[addon._id]}
                  />
                </List.Item>
              ))}

            <List.Item>
              <Button
                basic
                circular
                type="button"
                color="teal"
                content="Add an add-on"
                icon="add circle"
                labelPosition="right"
                onClick={() => {
                  this.handleAddAddon();
                }}
              />
            </List.Item>
          </List>
        </Segment>

        <Confirm
          open={this.state.showDeleteServiceConfirm}
          content={`Remove service category - ${service.name}?`}
          onCancel={() => {
            this.setState({ showDeleteServiceConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showDeleteServiceConfirm: false });
            onDelete();
          }}
        />
      </div>
    );
  }
}

StylistServiceItem.defaultProps = {
  errors: {},
};

StylistServiceItem.propTypes = {
  service: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
};

export default StylistServiceItem;
