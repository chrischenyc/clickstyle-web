import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Segment, Message, Confirm, List, Input, Label, Divider, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import StylistServiceAddonItem from './StylistServiceAddonItem';

class StylistServiceItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteServiceConfirm: false,
      service: _.cloneDeep(props.service),
    };

    this.handleAddAddon = this.handleAddAddon.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      service: _.cloneDeep(nextProps.service),
    });
  }

  handleAddAddon() {
    const newAddon = {
      name: '',
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
              Base price:&nbsp;&nbsp;
              <Input labelPosition="right" type="text" placeholder="Amount">
                <Label basic>$</Label>
                <input type="number" />
                <Label>.00</Label>
              </Input>
            </List.Item>

            <List.Item>
              <Divider horizontal>Add-ons</Divider>
            </List.Item>

            {service.addons &&
              service.addons.map((addon) => {
                console.log(addon);

                return (
                  <List.Item>
                    <StylistServiceAddonItem addon={addon} />
                  </List.Item>
                );
              })}

            <List.Item>
              <Button
                basic
                color={Meteor.settings.public.semantic.color}
                content="Add an add-on"
                icon="add circle"
                type="button"
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
