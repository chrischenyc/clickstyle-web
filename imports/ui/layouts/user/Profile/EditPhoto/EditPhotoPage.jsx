import React from 'react';
import PropTypes from 'prop-types';
import { Message, Image, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { UploadField } from '@navjobs/upload';

// web version of the login form, stateless component
const EditPhotoPage = ({
  photo, onFile, onSave, saving, errors,
}) => (
  <div>
    <Image src={photo && photo.origin} size="medium" />
    <p>Your photo will appear on your public profile</p>
    <UploadField
      onFiles={(files) => {
        const file = files[0];
        if (file) {
          onFile(file);
        }
      }}
      uploadProps={{
        accept: '.jpg,.jpeg,.png,.bmp,.gif',
      }}
    >
      <Button color="teal" loading={saving}>
        Upload photo
      </Button>
      <span>&nbsp;image file max size: 2MB</span>
    </UploadField>

    {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
  </div>
);

EditPhotoPage.defaultProps = {
  photo: {},
};

EditPhotoPage.propTypes = {
  photo: PropTypes.object,
  onFile: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditPhotoPage;
