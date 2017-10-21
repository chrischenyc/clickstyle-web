import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Profiles from '../../../../api/profiles/profiles';

import { validateEditProfile } from '../../../../modules/validate';
import GeoSuggestToAddress from '../../../../modules/geo-suggest-to-address';
import ProfilePage from './ProfilePage';

// platform-independent stateful container component
// to handle edit user profile logic
class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoError: '',
      photoUploading: false,
      photoPristine: true,
      profile: {},
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handlePhotoSelected = this.handlePhotoSelected.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddressSuggest = this.handleAddressSuggest.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({ profile: _.cloneDeep(nextProps.profile), pristine: true });
  }

  handlePhotoSelected() {
    this.setState({ photoPristine: false });
  }

  handlePhotoUpload(file) {
    this.setState({ photoError: '' });

    // define S3 saving path
    const metaContext = { path: 'photos/profile' };
    const upload = new Slingshot.Upload(
      Meteor.settings.public.SlingshotClientDirective,
      metaContext,
    );

    const validateError = upload.validate(file);

    if (validateError) {
      this.setState({ photoError: validateError.reason });
    } else {
      this.setState({ photoUploading: true });

      upload.send(file, (uploadError, downloadUrl) => {
        if (uploadError) {
          this.setState({ photoUploading: false, photoError: uploadError.reason });
        } else {
          // update user profile.photo.original
          Meteor.call('profiles.update', { photo: { origin: downloadUrl } }, (callError) => {
            this.setState({ photoUploading: false, photoError: '' });

            if (callError) {
              this.setState({ photoError: callError.reason });
            } else {
              // TODO: notify success
              this.setState({ photoPristine: true });
            }
          });
        }
      });
    }
  }

  handleChange(event) {
    let newProfile = _.cloneDeep(this.state.profile);
    newProfile = _.set(newProfile, event.target.name, event.target.value);

    if (event.target.name === 'address.raw' && _.isEmpty(event.target.value)) {
      newProfile.address = {};
    }

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

  handleAddressSuggest(suggest) {
    const address = GeoSuggestToAddress(suggest);

    this.setState({
      profile: { ...this.state.profile, address },
    });
  }

  render() {
    return (
      <ProfilePage
        photo={this.props.profile.photo}
        onPhotoSelected={this.handlePhotoSelected}
        onPhotoUpload={this.handlePhotoUpload}
        photoUploading={this.state.photoUploading}
        photoPristine={this.state.photoPristine}
        photoError={this.state.photoError}
        profile={this.state.profile}
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onAddressSuggest={this.handleAddressSuggest}
        loading={this.props.fetching}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

Profile.defaultProps = {
  profile: {},
};

Profile.propTypes = {
  fetching: PropTypes.bool.isRequired,
  profile: PropTypes.object,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('profiles.owner');

  return {
    fetching: !handle.ready(),
    profile: Profiles.findOne({}),
  };
})(Profile);
