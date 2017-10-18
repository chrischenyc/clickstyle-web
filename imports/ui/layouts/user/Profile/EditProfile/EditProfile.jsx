import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Profiles from '../../../../../api/profiles/profiles';

import { validateEditProfile } from '../../../../../modules/validate';
import EditProfilePage from './EditProfilePage';

// platform-independent stateful container component
// to handle edit user profile logic
class EditProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {},
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({ profile: _.cloneDeep(nextProps.profile), pristine: true });
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
      <EditProfilePage
        profile={this.state.profile}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.saving || this.props.fetching}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

EditProfile.defaultProps = {
  profile: {},
};

EditProfile.propTypes = {
  fetching: PropTypes.bool.isRequired,
  profile: PropTypes.object,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('profiles.owner');

  return {
    fetching: !handle.ready(),
    profile: Profiles.findOne({}),
  };
})(EditProfile);
