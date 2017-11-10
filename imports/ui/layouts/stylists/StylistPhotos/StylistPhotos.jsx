import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { validateEditProfile } from '../../../../modules/validate';
import StylistPhotosPage from './StylistPhotosPage';

// platform-independent stateful container component
// to handle edit user profile logic
class StylistPhotos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoError: '',
      photoUploading: false,
      photoPristine: true,
      profile: _.cloneDeep(props.profile),
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handlePhotoSelected = this.handlePhotoSelected.bind(this);
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
    this.handlePhotoRemove = this.handlePhotoRemove.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state
    this.setState({
      pristine: true,
      profile: _.cloneDeep(nextProps.profile),
    });
  }

  handlePhotoSelected() {
    this.setState({ photoPristine: false });
  }

  handlePhotoRemove() {
    Meteor.call('profiles.photo.remove', (callError) => {
      if (callError) {
        this.setState({ photoError: callError.reason });
      }
    });
  }

  handlePhotoUpload(file) {
    this.setState({ photoError: '' });

    const upload = new Slingshot.Upload(Meteor.settings.public.SlingshotCloudinaryImage);
    const validateError = upload.validate(file);

    if (validateError) {
      this.setState({ photoError: validateError.reason });
    } else {
      this.setState({ photoUploading: true });

      upload.send(file, (uploadError, downloadUrl) => {
        if (uploadError) {
          this.setState({
            photoUploading: false,
            photoError: uploadError.reason,
          });
        } else {
          // attach cloudinary url to profile
          Meteor.call(
            'profiles.photo.add',
            downloadUrl.replace('http://', 'https://'),
            (callError) => {
              this.setState({ photoUploading: false, photoError: '' });

              if (callError) {
                this.setState({ photoError: callError.reason });
              } else {
                this.setState({ photoPristine: true });
              }
            },
          );
        }
      });
    }
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
      <StylistPhotosPage
        photo={this.props.profile.photo}
        onPhotoSelected={this.handlePhotoSelected}
        onPhotoUpload={this.handlePhotoUpload}
        onPhotoRemove={this.handlePhotoRemove}
        photoUploading={this.state.photoUploading}
        photoPristine={this.state.photoPristine}
        photoError={this.state.photoError}
        profile={this.state.profile}
        onSubmit={this.handleSubmit}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

StylistPhotos.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default connect(state => ({
  profile: state.profile,
}))(StylistPhotos);
