import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import { validateStylistServices } from '../../../../modules/validate';
import StylistServicesPage from './StylistServicesPage';

const availableServices = (allServices, selectedServices) => {
  const selectedServicedIds = selectedServices.map(service => service._id);

  return allServices.filter(service => selectedServicedIds.indexOf(service._id) === -1);
};

// platform-independent stateful container component
// to handle edit stylist services and prices logic
class StylistServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      allServices: [],
      publicAddons: [],
      selectedServices: [],
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.handleAddServices = this.handleAddServices.bind(this);
    this.handleChangeService = this.handleChangeService.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadStylistServices = this.loadStylistServices.bind(this);
  }

  componentDidMount() {
    Meteor.call('services.list', (error, allServices) => {
      if (error) {
        this.setState({ errors: { message: error.reason } });
      } else {
        this.setState({ allServices });
      }
    });

    Meteor.call('addons.list.published', (error, publicAddons) => {
      if (error) {
        this.setState({ errors: { message: error.reason } });
      } else {
        this.setState({ publicAddons });
      }
    });

    this.loadStylistServices();
  }

  loadStylistServices() {
    this.setState({ loading: true });

    Meteor.call('stylists.services', (error, services) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({
          errors: { message: error.reason },
        });
      } else {
        this.setState({
          pristine: true,
          selectedServices: services ? _.cloneDeep(services) : [],
        });
      }
    });
  }

  handleDeleteService(service) {
    this.setState(
      {
        pristine: false,
        selectedServices: this.state.selectedServices.filter(selectedService => selectedService._id !== service._id),
      },
      () => {
        this.handleSubmit();
      },
    );
  }

  handleAddServices(services) {
    this.setState({
      pristine: false,
      selectedServices: [
        ...this.state.selectedServices,
        ...services.map(service => ({
          ..._.omit(service, 'duration'),
          baseDuration: service.duration,
        })),
      ],
    });
  }

  handleChangeService(changedService) {
    this.setState({
      pristine: false,
      selectedServices: this.state.selectedServices.map((service) => {
        if (changedService._id === service._id) {
          return changedService;
        }
        return service;
      }),
    });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });

    if (!_.isNil(event)) {
      event.preventDefault();
    }

    const errors = validateStylistServices(this.state.selectedServices);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ saving: true });

      Meteor.call('stylists.services.update', this.state.selectedServices, (error) => {
        this.setState({ saving: false, errors: {}, pristine: true });

        if (error) {
          this.setState({ errors: { message: error.reason } });
        }

        this.loadStylistServices();
      });
    }
  }

  render() {
    return (
      <StylistServicesPage
        selectedServices={this.state.selectedServices}
        availableServices={availableServices(this.state.allServices, this.state.selectedServices)}
        publicAddons={this.state.publicAddons}
        onSubmit={this.handleSubmit}
        onChangeService={this.handleChangeService}
        onDeleteService={this.handleDeleteService}
        onAddServices={this.handleAddServices}
        loading={this.state.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

export default StylistServices;
