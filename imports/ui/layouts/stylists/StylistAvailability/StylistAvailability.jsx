import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Stylists from '../../../../api/stylists/stylists';
import { validateStylistOpenHours } from '../../../../modules/validate';
import StylistAvailabilityPage from './StylistAvailabilityPage';

// platform-independent stateful container component
// to handle edit stylist opening hours
class StylistAvailability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openHours:
        props.stylist && props.stylist.openHours ? _.cloneDeep(props.stylist.openHours) : [],
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state

    this.setState({
      pristine: true,
      openHours:
        nextProps.stylist && nextProps.stylist.openHours
          ? _.cloneDeep(nextProps.stylist.openHours)
          : [],
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
        pristine: _.isEqual(this.props.stylist.openHours, newOpenHours),
        openHours: newOpenHours,
      });
    }
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    /*
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

    */
  }

  render() {
    return (
      <StylistAvailabilityPage
        openHours={this.state.openHours}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        loading={this.props.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

StylistAvailability.defaultProps = {
  loading: false,
  stylist: null,
};

StylistAvailability.propTypes = {
  loading: PropTypes.bool,
  stylist: PropTypes.object,
};

export default withTracker(() => {
  const handleStylist = Meteor.subscribe('stylists.owner');

  return {
    loading: !handleStylist.ready(),
    stylist: Stylists.findOne(),
  };
})(StylistAvailability);
