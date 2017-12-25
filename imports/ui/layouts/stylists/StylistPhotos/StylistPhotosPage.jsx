import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import EditPhotoPage from './EditPhotoPage';

const StylistPhotosPage = ({
  photo,
  onPhotoSelected,
  onPhotoUpload,
  onPhotoRemove,
  photoUploading,
  photoPristine,
  photoError,
  profile,
  onSubmit,
  saving,
  pristine,
  errors,
}) => (
  <div className="container">
    <Button color="teal" as={Link} to={`/profiles/${profile._id}`}>
      View stylist profile
    </Button>
    <Form
      onSubmit={onSubmit}
      loading={profile.fetching || saving}
      error={!_.isEmpty(errors) || !_.isEmpty(photoError)}
    >
      <Divider horizontal>Banner image</Divider>

      <EditPhotoPage
        photo={photo}
        onPhotoSelected={onPhotoSelected}
        onPhotoUpload={onPhotoUpload}
        onPhotoRemove={onPhotoRemove}
        photoUploading={photoUploading}
        photoPristine={photoPristine}
        photoError={photoError}
      />

      <Divider horizontal>Portfolio images</Divider>

      <Button color="teal" size="large" type="submit" disabled={pristine} loading={saving}>
        Save
      </Button>

      {!_.isEmpty(errors.message) && <div className="notification error"> {errors.message} </div>}
    </Form>
  </div>
);

StylistPhotosPage.defaultProps = {
  photo: null,
};

StylistPhotosPage.propTypes = {
  profile: PropTypes.object.isRequired,
  photo: PropTypes.string,
  onPhotoSelected: PropTypes.func.isRequired,
  onPhotoUpload: PropTypes.func.isRequired,
  onPhotoRemove: PropTypes.func.isRequired,
  photoUploading: PropTypes.bool.isRequired,
  photoPristine: PropTypes.bool.isRequired,
  photoError: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistPhotosPage;
