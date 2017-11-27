import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Stylists from '../../../../api/stylists/stylists';
import StylistAvailableAreasPage from './StylistAvailableAreasPage';

// platform-independent stateful container component
// to handle edit stylist servicing areas
class StylistAvailability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      saving: false,
      pristine: true,
      radius: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state

    this.setState({
      pristine: true,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
    // const newOpenHours = this.state.openHours.map((openHour) => {
    //   if (openHour.day === day) {
    //     return _.set(openHour, name, value);
    //   }
    //   return openHour;
    // });
    // // validate
    // const errors = validateStylistOpenHours(newOpenHours);
    // this.setState({ errors });
    // if (_.isEmpty(errors)) {
    //   this.setState({
    //     pristine: _.isEqual(this.props.stylist.openHours, newOpenHours),
    //     openHours: newOpenHours,
    //   });
    // }
  }

  handleSubmit(event) {
    // this.setState({ errors: {} });
    // event.preventDefault();
    // const errors = validateStylistOpenHours(this.state.openHours);
    // if (!_.isEmpty(errors)) {
    //   this.setState({ errors });
    // } else {
    //   this.setState({ saving: true });
    //   Meteor.call('stylists.update.openHours', this.state.openHours, (error) => {
    //     this.setState({ saving: false, errors: {}, pristine: true });
    //     if (error) {
    //       this.setState({ errors: { message: error.reason } });
    //     }
    //   });
    // }
  }

  render() {
    return (
      <StylistAvailableAreasPage
        radius={this.state.radius}
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
