import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Form,
  Message,
  Modal,
  Divider,
  List,
  Checkbox,
} from 'semantic-ui-react';
import _ from 'lodash';

import SideMenuContainer from '../../../components/SideMenuContainer';
import {
  FormInputField,
  FormFieldErrorMessage,
  FormFieldNote,
} from '../../../components/FormInputField';
import StylistServiceItem from './StylistServiceItem';

class StylistServicesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAvailableServicesModal: false,
      servicesToAdd: [],
    };
  }

  render() {
    const {
      selectedServices,
      availableServices,
      onSubmit,
      onChange,
      onDeleteService,
      onAddServices,
      loading,
      saving,
      pristine,
      errors,
    } = this.props;

    const availableServicesModal = (
      <Modal
        open={this.state.showAvailableServicesModal}
        size="mini"
        onClose={() => {
          this.setState({ showAvailableServicesModal: false, servicesToAdd: [] });
        }}
      >
        <Modal.Header>Select more services</Modal.Header>

        <Modal.Content>
          <List size="large">
            {availableServices.map(service => (
              <List.Item key={service._id}>
                <Checkbox
                  label={service.name}
                  onChange={(event, data) => {
                    if (data.checked) {
                      this.setState({ servicesToAdd: [...this.state.servicesToAdd, service] });
                    } else {
                      this.setState({
                        servicesToAdd: this.state.servicesToAdd.filter(serviceToAdd => serviceToAdd._id !== service._id),
                      });
                    }
                  }}
                />
              </List.Item>
            ))}
          </List>
        </Modal.Content>

        <Modal.Actions>
          <Button
            onClick={() => {
              this.setState({ showAvailableServicesModal: false, servicesToAdd: [] });
            }}
          >
            Cancel
          </Button>
          <Button
            color={Meteor.settings.public.semantic.color}
            onClick={() => {
              onAddServices(this.state.servicesToAdd);
              this.setState({ showAvailableServicesModal: false, servicesToAdd: [] });
            }}
          >
            Confirm
          </Button>
        </Modal.Actions>
      </Modal>
    );

    return (
      <SideMenuContainer>
        <Container text>
          <Form onSubmit={onSubmit} loading={loading || saving} error={!_.isEmpty(errors)}>
            <Divider horizontal>Services &amp; Prices</Divider>

            {selectedServices.map(service => (
              <StylistServiceItem
                key={service._id}
                service={service}
                onDelete={() => {
                  onDeleteService(service);
                }}
              />
            ))}

            {availableServices.length > 0 && (
              <p>
                <Button
                  color={Meteor.settings.public.semantic.color}
                  size="large"
                  content="Add more services"
                  icon="add circle"
                  type="button"
                  labelPosition="right"
                  onClick={() => {
                    this.setState({ showAvailableServicesModal: true });
                  }}
                />
              </p>
            )}

            <Button
              color={Meteor.settings.public.semantic.color}
              size="massive"
              type="submit"
              disabled={pristine}
              loading={saving}
            >
              Save
            </Button>

            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>

          {availableServicesModal}
        </Container>
      </SideMenuContainer>
    );
  }
}

StylistServicesPage.propTypes = {
  selectedServices: PropTypes.array.isRequired,
  availableServices: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
