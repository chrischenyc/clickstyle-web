import React from 'react';
import PropTypes from 'prop-types';
import { Message, Image, Progress, Grid, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { UploadField } from '@navjobs/upload';

// web version of the login form, stateless component
const EditPhotoPage = ({
  photo, onFile, saving, errors,
}) => (
  <div>
    <Grid>
      <Grid.Row>
        <Grid.Column width="6">
          <Image src={photo && photo.origin} size="medium" />
        </Grid.Column>

        <Grid.Column width="10">
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
            <span>
              Select your photo to upload (jpg, png, gif), it will appear on your public
              profile&nbsp;
            </span>
            <Button color="teal" loading={saving}>
              Select image
            </Button>
          </UploadField>

          {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          {saving && (
            <Progress
              percent={20}
              autoSuccess
              progress
              indicating
              color="teal"
              size="small"
              style={{ margin: '1rem 0' }}
            />
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

EditPhotoPage.defaultProps = {
  photo: {},
};

EditPhotoPage.propTypes = {
  photo: PropTypes.object,
  onFile: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditPhotoPage;
