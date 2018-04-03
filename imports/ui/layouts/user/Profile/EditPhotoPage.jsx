import { Meteor } from 'meteor/meteor';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Button, Message } from 'semantic-ui-react';
import _ from 'lodash';
import { UploadField as FileField } from '@navjobs/upload';
import AvatarEditor from 'react-avatar-editor';

import scaledImageURL from '../../../../modules/scaled-image-url';

const ImageSize = 280;

class EditPhotoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      scale: 1.0,
      rotate: 0,
      openRemoveConfirm: false,
    };
  }

  render() {
    const {
      photo,
      onPhotoSelected,
      onPhotoUpload,
      onPhotoRemove,
      photoUploading,
      photoPristine,
      photoError,
    } = this.props;

    const {
      file, scale, rotate, openRemoveConfirm,
    } = this.state;

    const displayPhotoUrl = photo || Meteor.settings.public.defaultAvatar;

    // if file selected, show photo editor UI
    return (
      <Fragment>
        {file && !photoPristine ? (
          <Fragment>
            <AvatarEditor
              image={file}
              width={ImageSize}
              height={ImageSize}
              scale={scale}
              rotate={rotate}
              border={0}
              ref={(editor) => {
                this.editor = editor;
              }}
            />

            <p>Your photo will appear on your public profile</p>

            <div
              style={{
                display: 'table-cell',
                verticalAlign: 'middle',
              }}
            >
              <span>Zoom&nbsp;</span>
              <input
                type="range"
                min="100"
                max="300"
                defaultValue="100"
                disabled={photoUploading}
                onChange={(event) => {
                  this.setState({ scale: event.target.value / 100.0 });
                }}
                style={{ width: '200px', display: 'inline-block', height: '100%' }}
              />

              <span>&nbsp;&nbsp;Rotate&nbsp;</span>

              <Button
                circular
                icon="repeat"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({ rotate: rotate + 90 });
                }}
              />
            </div>

            <Button
              circular
              onClick={(event) => {
                event.preventDefault();

                this.setState({
                  file: null,
                  scale: 1.0,
                });
              }}
              disabled={photoUploading}
            >
              Cancel
            </Button>

            <Button
              circular
              color="teal"
              onClick={(event) => {
                event.preventDefault();

                const canvas = this.editor.getImage();

                // convert to jpeg format
                // rename file name to photo.jpeg
                canvas.toBlob(
                  (blob) => {
                    onPhotoUpload(blob);
                  },
                  'image/jpeg',
                  1,
                );
              }}
              loading={photoUploading}
            >
              Save
            </Button>
          </Fragment>
        ) : (
          <Fragment>
            <img src={scaledImageURL(displayPhotoUrl, 'medium')} width={ImageSize} alt="" />

            <p>Your photo will appear on your public profile</p>

            {photo && (
              <Button
                circular
                negative
                onClick={() => {
                  this.setState({ openRemoveConfirm: true });
                }}
                style={{ marginBottom: '0.5rem' }}
              >
                Remove photo
              </Button>
            )}

            <FileField
              onFiles={(files) => {
                this.setState({ file: files[0], scale: 1.0, rotate: 0 });
                onPhotoSelected();
              }}
              uploadProps={{
                accept: '.jpg,.jpeg,.png',
              }}
            >
              <Button circular color="teal" loading={photoUploading}>
                Upload photo
              </Button>
              <span>&nbsp;maximum image file size: {Meteor.settings.public.maxPhotoSize}MB</span>
            </FileField>

            <Confirm
              open={openRemoveConfirm}
              onCancel={() => {
                this.setState({ openRemoveConfirm: false });
              }}
              onConfirm={() => {
                this.setState({ openRemoveConfirm: false });
                onPhotoRemove();
              }}
            />
          </Fragment>
        )}

        {!_.isEmpty(photoError) && <Message error>{photoError}</Message>}
      </Fragment>
    );
  }
}

EditPhotoPage.defaultProps = {
  photo: {},
};

EditPhotoPage.propTypes = {
  photo: PropTypes.string,
  onPhotoSelected: PropTypes.func.isRequired,
  onPhotoUpload: PropTypes.func.isRequired,
  onPhotoRemove: PropTypes.func.isRequired,
  photoUploading: PropTypes.bool.isRequired,
  photoPristine: PropTypes.bool.isRequired,
  photoError: PropTypes.string.isRequired,
};

export default EditPhotoPage;
