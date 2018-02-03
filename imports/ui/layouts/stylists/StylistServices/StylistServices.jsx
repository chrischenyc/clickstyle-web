import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Services from '../../../../api/services/services';
import Addons from '../../../../api/addons/addons';
import Stylists from '../../../../api/stylists/stylists';
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
      selectedServices:
        props.stylist && props.stylist.services ? _.cloneDeep(props.stylist.services) : [],
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.handleAddServices = this.handleAddServices.bind(this);
    this.handleChangeService = this.handleChangeService.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      pristine: true,
      selectedServices:
        nextProps.stylist && nextProps.stylist.services
          ? _.cloneDeep(nextProps.stylist.services)
          : [],
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
        ...services.map(service => ({ ..._.omit(service, 'duration'), baseDuration: service.duration })),
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

      Meteor.call('stylists.update.services', this.state.selectedServices, (error) => {
        this.setState({ saving: false, errors: {}, pristine: true });

        if (error) {
          this.setState({ errors: { message: error.reason } });
        }
      });
    }
  }

  render() {
    return (
      <StylistServicesPage
        selectedServices={this.state.selectedServices}
        availableServices={availableServices(this.props.allServices, this.state.selectedServices)}
        publicAddons={this.props.publicAddons}
        onSubmit={this.handleSubmit}
        onChangeService={this.handleChangeService}
        onDeleteService={this.handleDeleteService}
        onAddServices={this.handleAddServices}
        loading={this.props.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

StylistServices.defaultProps = {
  loading: false,
  stylist: null,
  allServices: [],
  publicAddons: [],
};

StylistServices.propTypes = {
  loading: PropTypes.bool,
  stylist: PropTypes.object,
  allServices: PropTypes.array,
  publicAddons: PropTypes.array,
};

export default withTracker(() => {
  const handleStylist = Meteor.subscribe('stylists.owner');
  const handleServices = Meteor.subscribe('services');
  const handleAddons = Meteor.subscribe('addons');

  return {
    loading: !handleServices.ready() || !handleStylist.ready() || !handleAddons.ready(),
    stylist: Stylists.findOne(),
    allServices: Services.find(
      {},
      {
        sort: { displayOrder: 1 },
      },
    ).fetch(),
    publicAddons: Addons.find().fetch(),
  };
})(StylistServices);
