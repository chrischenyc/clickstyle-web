import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import Services from '../../../../api/services/services';
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
      selectedServices: _.cloneDeep(props.selectedServices),
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleDeleteService = this.handleDeleteService.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      pristine: true,
      selectedServices: _.cloneDeep(nextProps.selectedServices),
    });
  }

  handleDeleteService(service) {
    this.setState({
      pristine: false,
      selectedServices: this.state.selectedServices.filter(selectedService => selectedService._id !== service._id),
    });
  }

  handleChange(event) {}

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

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
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onDeleteService={this.handleDeleteService}
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
  selectedServices: [],
  allServices: [],
};

StylistServices.propTypes = {
  loading: PropTypes.bool,
  selectedServices: PropTypes.array,
  allServices: PropTypes.array,
};

export default compose(
  connect(state => ({
    loading: state.profile.fetching,
    selectedServices: state.profile && state.profile.stylist && state.profile.stylist.services,
  })),
  withTracker(() => {
    Meteor.subscribe('services');

    return {
      allServices: Services.find().fetch(),
    };
  }),
)(StylistServices);
