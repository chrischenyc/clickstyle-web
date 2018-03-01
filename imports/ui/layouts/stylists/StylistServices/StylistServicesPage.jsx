import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, List, Checkbox, Button, Container } from 'semantic-ui-react';
import _ from 'lodash';

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
      publicAddons,
      onSubmit,
      onChangeService,
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
            circular
            onClick={() => {
              this.setState({ showAvailableServicesModal: false, servicesToAdd: [] });
            }}
          >
            Cancel
          </Button>
          <Button
            circular
            color="teal"
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
      <Container>
        <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
          <p>TODO: write something to educate stylists what this page is about</p>

          {selectedServices.map((service) => {
            const addons = publicAddons.filter(addon => addon.serviceId === service._id);

            return (
              <StylistServiceItem
                key={service._id}
                service={{ ...service, publicAddons: addons }}
                onDelete={() => {
                  onDeleteService(service);
                }}
                onChange={onChangeService}
                errors={errors[service._id]}
              />
            );
          })}

          {availableServices.length > 0 && (
            <p>
              <Button
                basic
                circular
                color="teal"
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
            circular
            color="teal"
            size="huge"
            type="submit"
            disabled={pristine}
            loading={saving}
          >
            Save
          </Button>

          {!_.isEmpty(errors.message) && (
            <div className="notification error"> {errors.message} </div>
          )}
        </Form>

        {availableServicesModal}
      </Container>
    );
  }
}

StylistServicesPage.propTypes = {
  selectedServices: PropTypes.array.isRequired,
  availableServices: PropTypes.array.isRequired,
  publicAddons: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChangeService: PropTypes.func.isRequired,
  onDeleteService: PropTypes.func.isRequired,
  onAddServices: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
