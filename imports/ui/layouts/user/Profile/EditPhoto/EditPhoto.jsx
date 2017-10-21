import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Profiles from '../../../../../api/profiles/profiles';
import EditPhotoPage from './EditPhotoPage';

// platform-independent stateful container component
// to handle edit user photo logic
class EditPhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleFile = this.handleFile.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleFile() {
    this.setState({ pristine: false });
  }

  handleSave(file) {
    this.setState({ errors: {} });

    // define S3 saving path
    const metaContext = { path: 'photos/profile' };
    const upload = new Slingshot.Upload(
      Meteor.settings.public.SlingshotClientDirective,
      metaContext,
    );

    const validateError = upload.validate(file);

    if (validateError) {
      this.setState({ errors: { message: validateError.reason } });
    } else {
      this.setState({ saving: true });

      upload.send(file, (uploadError, downloadUrl) => {
        if (uploadError) {
          this.setState({ saving: false, errors: { message: uploadError.reason } });
        } else {
          // update user profile.photo.original
          Meteor.call('profiles.update', { photo: { origin: downloadUrl } }, (callError) => {
            this.setState({ saving: false, errors: {} });

            if (callError) {
              this.setState({ errors: { message: callError.reason } });
            } else {
              // TODO: notify success
              this.setState({ pristine: true });
            }
          });
        }
      });
    }
  }

  render() {
    return (
      <EditPhotoPage
        photo={this.props.photo}
        onFile={this.handleFile}
        onSave={this.handleSave}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

EditPhoto.defaultProps = {
  photo: {},
};

EditPhoto.propTypes = {
  photo: PropTypes.object,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('profiles.owner');

  return {
    fetching: !handle.ready(),
    photo: Profiles.findOne({}).photo,
  };
})(EditPhoto);
