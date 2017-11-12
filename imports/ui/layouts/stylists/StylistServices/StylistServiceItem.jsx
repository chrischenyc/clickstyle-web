import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Segment, Message, Confirm, List, Input, Label, Divider, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuid from 'uuid/v1';

import StylistServiceAddonItem from './StylistServiceAddonItem';

class StylistServiceItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteServiceConfirm: false,
      service: _.cloneDeep(props.service),
    };

    this.handleAddAddon = this.handleAddAddon.bind(this);
    this.handleRemoveAddon = this.handleRemoveAddon.bind(this);
    this.handleChangeAddon = this.handleChangeAddon.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      service: _.cloneDeep(nextProps.service),
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

    if (!service.addons) {
      this.setState({ service: { ...service, addons: [newAddon] } });
    } else {
      this.setState({
        service: { ...service, addons: [...service.addons, newAddon] },
      });
    }
  }

  handleRemoveAddon(addonToRemove) {
    const { service } = this.state;

    this.setState({
      service: {
        ...service,
        addons: service.addons.filter(addon => addon._id !== addonToRemove._id),
      },
    });
  }

  handleChangeAddon(addonToChange, event) {
    const { service } = this.state;
    this.setState({
      service: {
        ...service,
        addons: service.addons.map((addon) => {
          if (addon._id === addonToChange._id) {
            const updatedAddon = { ...addonToChange };

            updatedAddon[event.target.name] = event.target.value;

            return updatedAddon;
          }
          return addon;
        }),
      },
    });
  }

  render() {
    const { service } = this.state;
    const { onDelete } = this.props;

    return (
      <div style={{ padding: '1rem 0' }}>
        <Message
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
              <Input label="Base price" type="number" placeholder="Amount" min="1" />
            </List.Item>

            <List.Item>
              <Divider horizontal>Add-ons</Divider>
            </List.Item>

            {service.addons &&
              service.addons.map(addon => (
                <List.Item key={addon._id}>
                  <StylistServiceAddonItem
                    addon={addon}
                    onRemove={() => {
                      this.handleRemoveAddon(addon);
                    }}
                    onChange={(event) => {
                      this.handleChangeAddon(addon, event);
                    }}
                  />
                </List.Item>
              ))}

            <List.Item>
              <Button
                basic
                type="button"
                color={Meteor.settings.public.semantic.color}
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

StylistServiceItem.propTypes = {
  service: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default StylistServiceItem;
