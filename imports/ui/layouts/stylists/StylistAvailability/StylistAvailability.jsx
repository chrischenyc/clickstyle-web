import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import { validateStylistOpenHours } from '../../../../modules/validate';
import StylistAvailabilityPage from './StylistAvailabilityPage';

// platform-independent stateful container component
// to handle edit stylist opening hours
class StylistAvailability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      stylistOpenHours: [],
      openHours: [],
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadStylist = this.loadStylistOpenHours.bind(this);
  }

  componentDidMount() {
    this.loadStylistOpenHours();
  }

  loadStylistOpenHours() {
    this.setState({ loading: true });

    Meteor.call('stylists.openHours', (error, openHours) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({
          errors: {
            message: error.reason,
          },
        });
      } else {
        this.setState({
          pristine: true,
          stylistOpenHours: openHours || [],
          openHours: openHours ? _.cloneDeep(openHours) : [],
        });
      }
    });
  }

  handleChange(day, name, value) {
    const newOpenHours = this.state.openHours.map((openHour) => {
      if (openHour.day === day) {
        return _.set(openHour, name, value);
      }
      return openHour;
    });

    // validate
    const errors = validateStylistOpenHours(newOpenHours);
    this.setState({ errors });

    if (_.isEmpty(errors)) {
      this.setState({
        pristine: _.isEqual(this.state.stylistOpenHours, newOpenHours),
        openHours: newOpenHours,
      });
    }
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateStylistOpenHours(this.state.openHours);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ saving: true });

      Meteor.call('stylists.openHours.update', this.state.openHours, (error) => {
        this.setState({ saving: false, errors: {}, pristine: true });

        if (error) {
          this.setState({ errors: { message: error.reason } });
        }

        this.loadStylistOpenHours();
      });
    }
  }

  render() {
    return (
      <StylistAvailabilityPage
        openHours={this.state.openHours}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        loading={this.state.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

export default StylistAvailability;
