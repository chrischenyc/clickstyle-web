import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Segment, Message, Confirm, List, Input, Label, Divider, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class StylistServiceItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteServiceConfirm: false,
    };
  }

  render() {
    const { service, onDelete } = this.props;

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
              Base price:&nbsp;
              <Input labelPosition="right" type="text" placeholder="Amount">
                <Label basic>$</Label>
                <input type="number" />
                <Label>.00</Label>
              </Input>
            </List.Item>
            <List.Item>
              <Divider horizontal>Add-ons</Divider>
            </List.Item>
            {/* TODO: map service.addons here */}
            <List.Item>
              <Button
                basic
                color={Meteor.settings.public.semantic.color}
                content="Add an add-on"
                icon="add"
                type="button"
                labelPosition="right"
                onClick={() => {
                  this.setState({ showAvailableServicesModal: true });
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
