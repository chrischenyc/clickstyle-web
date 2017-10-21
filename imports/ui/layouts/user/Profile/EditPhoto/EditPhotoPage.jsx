import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Message, Image, Button } from 'semantic-ui-react';
import _ from 'lodash';
import { UploadField as FileField } from '@navjobs/upload';
import AvatarEditor from 'react-avatar-editor';

// web version of the login form, stateless component

const ImageSize = 280;

class EditPhotoPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      scale: 1.0,
    };
  }

  render() {
    const {
      photo, onFile, onSave, saving, pristine, errors,
    } = this.props;

    const { file, scale } = this.state;

    // if file selected, show photo editor UI
    return (
      <div>
        {file && !pristine ? (
          <div>
            <AvatarEditor
              image={file}
              width={ImageSize}
              height={ImageSize}
              scale={scale}
              border={0}
              ref={(editor) => {
                this.editor = editor;
              }}
            />

            <p>Your photo will appear on your public profile</p>

            <span>Zoom:&nbsp;</span>
            <input
              type="range"
              min="100"
              max="300"
              defaultValue="100"
              disabled={saving}
              onChange={(event) => {
                this.setState({ scale: event.target.value / 100.0 });
              }}
            />

            <div>
              <Button.Group>
                <Button
                  onClick={() => {
                    this.setState({
                      file: null,
                      scale: 1.0,
                    });
                  }}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button.Or />
                <Button
                  positive
                  onClick={() => {
                    this.editor.getImage().toBlob((blob) => {
                      const ext = blob.type.split(/\//).pop();
                      blob.name = `photo${ext}`;
                      onSave(blob);
                    });
                  }}
                  loading={saving}
                >
                  Save
                </Button>
              </Button.Group>
            </div>
          </div>
        ) : (
          <div>
            <Image src={photo && photo.origin} width={ImageSize} height={ImageSize} />
            <p>Your photo will appear on your public profile</p>
            <FileField
              onFiles={(files) => {
                this.setState({ file: files[0] });
                onFile();
              }}
              uploadProps={{
                accept: '.jpg,.jpeg,.png,.bmp,.gif',
              }}
            >
              <Button color="teal" loading={saving}>
                Select photo
              </Button>
              <span>&nbsp;image file max size: 2MB</span>
            </FileField>
          </div>
        )}

        {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
      </div>
    );
  }
}

EditPhotoPage.defaultProps = {
  photo: {},
};

EditPhotoPage.propTypes = {
  photo: PropTypes.object,
  onFile: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditPhotoPage;
