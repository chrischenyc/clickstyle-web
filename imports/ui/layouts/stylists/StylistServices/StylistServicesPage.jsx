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
import StylistServiceItem from './StylistServiceItem';
import { PrimaryColor } from '../../../../modules/client/constants';

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
            onClick={() => {
              this.setState({ showAvailableServicesModal: false, servicesToAdd: [] });
            }}
          >
            Cancel
          </Button>
          <Button
            color={PrimaryColor}
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
        <Container>
          <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
            <p>TODO: write something to educate stylists what this page is about</p>

            <Divider horizontal>Services &amp; Prices</Divider>

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
                  color={PrimaryColor}
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
              color={PrimaryColor}
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
