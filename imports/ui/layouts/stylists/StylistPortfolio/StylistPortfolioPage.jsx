import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { UploadField } from '@navjobs/upload';
import { Grid, Button, Container, Icon } from 'semantic-ui-react';

import scaledImageURL from '../../../../modules/scaled-image-url';

const StylistPortfolioPage = ({
  photos,
  pristine,
  saving,
  onFilesSelected,
  onPhotoDeleted,
  onSave,
}) => (
  <Container>
    <h2>Portfolio photos</h2>

    <Grid className="margin-top-50 margin-bottom-50">
      <Grid.Row>
        <Grid.Column width="4" className="centered-content">
          {photos.length < Meteor.settings.public.maxPortfolioPhotos && (
            <UploadField
              onFiles={onFilesSelected}
              uploadProps={{
                accept: '.jpg,.jpeg,.png',
                multiple: true,
              }}
            >
              <Button size="large" basic circular color="teal">
                <Icon name="plus" />
                upload photos
              </Button>
              <p>maximum size: {Meteor.settings.public.maxPhotoSize}MB</p>
            </UploadField>
          )}

          {photos.length >= Meteor.settings.public.maxPortfolioPhotos && (
            <Fragment>
              <Button size="large" basic circular color="teal" disabled>
                <Icon name="plus" />
                upload photos
              </Button>
              <p>you can only upload {Meteor.settings.public.maxPortfolioPhotos} photos</p>
            </Fragment>
          )}
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        {photos.map(photo => (
          <Grid.Column computer="4" tablet="8" mobile="16" key={photo.displayOrder}>
            <div className="portfolio-photo">
              <img src={photo.local ? photo.url : scaledImageURL(photo.url, 'small')} alt="" />
              <Button
                circular
                id="delete-button"
                icon="trash outline"
                size="large"
                onClick={() => {
                  onPhotoDeleted(photo);
                }}
              />
              {photo.progress && <p>{photo.progress}</p>}
            </div>
          </Grid.Column>
        ))}
      </Grid.Row>

      {!pristine && (
        <Grid.Row>
          <Grid.Column width="4" className="centered-content">
            <Button size="large" basic circular color="teal" loading={saving} onClick={onSave}>
              Save
            </Button>
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  </Container>
);

StylistPortfolioPage.propTypes = {
  photos: PropTypes.array.isRequired,
  pristine: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  onFilesSelected: PropTypes.func.isRequired,
  onPhotoDeleted: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default StylistPortfolioPage;
