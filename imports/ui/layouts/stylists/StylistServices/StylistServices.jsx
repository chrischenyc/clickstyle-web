import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import Services from '../../../../api/services/services';
import { validateEditProfile } from '../../../../modules/validate';
import StylistServicesPage from './StylistServicesPage';

// platform-independent stateful container component
// to handle edit user profile logic
class StylistServices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: _.cloneDeep(props.profile),
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
      profile: _.cloneDeep(nextProps.profile),
    });
  }

  handleChange(event) {
    let newProfile = _.cloneDeep(this.state.profile);
    newProfile = _.set(newProfile, event.target.name, event.target.value);

    this.setState({
      profile: newProfile,
      pristine: _.isEqual(newProfile, this.props.profile),
    });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateEditProfile(this.state.profile);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ saving: true });

      Meteor.call('profiles.update', this.state.profile, (error) => {
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
        profile={this.state.profile}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        services={this.props.services}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

StylistServices.defaultProps = {
  services: [],
};

StylistServices.propTypes = {
  profile: PropTypes.object.isRequired,
  services: PropTypes.array,
};

export default compose(
  connect(state => ({
    profile: state.profile,
  })),
  withTracker(() => {
    Meteor.subscribe('services');

    return {
      services: Services.find().fetch(),
    };
  }),
)(StylistServices);
