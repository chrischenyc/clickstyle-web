import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { UploadField } from '@navjobs/upload';
import { Grid, Icon } from 'semantic-ui-react';

const StylistPortfolioPage = ({
  portfolioPhotos, saving, onFilesSelected, files,
}) => (
  <div className="container">
    <h2>Portfolio photos</h2>

    <Grid className="margin-top-50 margin-bottom-50">
      <Grid.Row>
        <Grid.Column width="4" className="centered-content">
          {portfolioPhotos.length + files.length < Meteor.settings.public.maxPortfolioPhotos && (
            <UploadField
              onFiles={onFilesSelected}
              uploadProps={{
                accept: '.jpg,.jpeg,.png',
                multiple: true,
              }}
            >
              <Icon name="upload" size="huge" />

              <p>
                upload portfolio photos<br />
                maximum file size: {Meteor.settings.public.maxPhotoSize}MB
              </p>
            </UploadField>
          )}

          {portfolioPhotos.length + files.length >= Meteor.settings.public.maxPortfolioPhotos && (
            <p>maximum portfolio photos reached</p>
          )}
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {files.map(file => (
          <Grid.Column
            width="4"
            key={`${file.source.name}_${file.source.lastModified}`}
            style={{ padding: '1rem' }}
          >
            <img src={file.image || ''} alt="" />
          </Grid.Column>
        ))}
      </Grid.Row>
    </Grid>
  </div>
);

StylistPortfolioPage.propTypes = {
  portfolioPhotos: PropTypes.array.isRequired,
  saving: PropTypes.bool.isRequired,
  onFilesSelected: PropTypes.func.isRequired,
  files: PropTypes.array.isRequired,
};

export default StylistPortfolioPage;
