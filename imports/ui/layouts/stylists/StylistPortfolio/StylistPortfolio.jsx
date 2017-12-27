import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { withTracker } from 'meteor/react-meteor-data';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import StylistPortfolioPage from './StylistPortfolioPage';
import { withLoading } from '../../../components/HOC';

/*
 * serial executes Promises sequentially.
 * @param {funcs} An array of funcs that return promises.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * serial(urls.map(url => () => $.ajax(url)))
 *     .then(console.log.bind(console))
 */
const serial = funcs =>
  funcs.reduce(
    (promise, func) => promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]),
  );

const compareFiles = (file1, file2) => {
  if (_.isNil(file1) || _.isNil(file2)) {
    return false;
  }

  return (
    file1.name === file2.name &&
    file1.size === file2.size &&
    file1.lastModified === file2.lastModified
  );
};

const isPristine = (portfolioPhotos, photos) => {
  if (portfolioPhotos.length !== photos.length) {
    return false;
  }

  for (let index = 0; index < portfolioPhotos.length; index += 1) {
    const portfolioPhoto = portfolioPhotos[index];
    const photo = photos[index];

    if (portfolioPhoto.url !== photo.url) {
      return false;
    }
  }

  return true;
};

class StylistPortfolio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portfolioPhotos: [], // server state
      photos: [], // working state
      pristine: true,
      saving: false,
    };

    this.handleFilesSelected = this.handleFilesSelected.bind(this);
    this.handlePhotoDeleted = this.handlePhotoDeleted.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.loadPortfolioPhotos();
  }

  loadPortfolioPhotos() {
    this.props.showLoading();
    Meteor.call('stylists.portfolio.photos', {}, (error, portfolioPhotos) => {
      this.props.hideLoading();

      const remotePhotos = portfolioPhotos.map(portfolioPhoto => ({
        url: portfolioPhoto.url,
        displayOrder: portfolioPhoto.displayOrder,
        local: false,
      }));

      const localPhotos = this.state.photos.filter(photo => photo.local);

      const photos = [...remotePhotos, ...localPhotos];

      this.setState({
        portfolioPhotos,
        photos,
        pristine: isPristine(portfolioPhotos, photos),
      });
    });
  }

  handleFilesSelected(files) {
    const newPhotos = [];
    const remainingPhotoSlots = Math.min(
      files.length,
      Meteor.settings.public.maxPortfolioPhotos - this.state.photos.length,
    );

    for (let index = 0; index < remainingPhotoSlots; index += 1) {
      const file = files[index];

      // avoid select same file
      if (this.state.photos.filter(photo => compareFiles(photo.file, file)).length === 0) {
        newPhotos.push({
          url: '/images/photo-placeholder.png',
          displayOrder: this.state.photos.length + index,
          local: true,
          file,
          progress: 'waiting for upload',
        });
      }
    }

    if (newPhotos.length > 0) {
      const photos = [...this.state.photos, ...newPhotos];
      this.setState({ pristine: isPristine(this.state.portfolioPhotos, photos), photos }, () => {
        newPhotos.forEach((newPhoto) => {
          this.displayLocalPhoto(newPhoto);
        });
      });
    }
  }

  handlePhotoDeleted(deletedPhoto) {
    const photos = this.state.photos.filter((photo) => {
      if (deletedPhoto.local) {
        return !compareFiles(photo.file, deletedPhoto.file);
      }
      return !(photo.url === deletedPhoto.url);
    });

    this.setState({
      pristine: isPristine(this.state.portfolioPhotos, photos),
      photos,
    });

    if (deletedPhoto.local) {
      if (deletedPhoto.upload) {
        deletedPhoto.upload.xhr.abort();
      }
    }
  }

  handleSave() {
    this.setState({ saving: true });

    // upload photos sequentially
    const photosToUpload = this.state.photos.filter(photo => photo.local);

    const promiseFuncs = photosToUpload.map(photoToUpload => () =>
      this.uploadLocalPhoto(photoToUpload));

    serial(promiseFuncs).then(() => {
      // call method
      const portfolioPhotos = this.state.photos.filter(photo => !photo.local).map(photo => ({
        url: photo.url,
        displayOrder: photo.displayOrder,
      }));

      Meteor.call('stylists.portfolio.photos.update', portfolioPhotos, () => {
        this.setState({
          saving: false,
        });

        this.loadPortfolioPhotos();
      });
    });
  }

  displayLocalPhoto(localPhoto) {
    const reader = new FileReader();

    reader.onloadend = () => {
      this.setState({
        photos: this.state.photos.map((photo) => {
          if (compareFiles(photo.file, localPhoto.file)) {
            return { ...photo, url: reader.result };
          }
          return photo;
        }),
      });
    };

    reader.readAsDataURL(localPhoto.file);
  }

  // promise
  uploadLocalPhoto(localPhoto) {
    return new Promise((resolve, reject) => {
      const upload = new Slingshot.Upload(Meteor.settings.public.SlingshotCloudinaryImage);

      this.setState({
        photos: this.state.photos.map((photo) => {
          if (compareFiles(photo.file, localPhoto.file)) {
            return {
              ...photo,
              upload,
            };
          }
          return photo;
        }),
      });

      // Track Progress
      const computation = Tracker.autorun(() => {
        if (!_.isNaN(upload.progress())) {
          this.setState({
            photos: this.state.photos.map((photo) => {
              if (compareFiles(photo.file, localPhoto.file)) {
                return {
                  ...photo,
                  progress: `uploading ${Math.floor(upload.progress() * 100)}%`,
                };
              }
              return photo;
            }),
          });
        }
      });

      upload.send(localPhoto.file, (error, url) => {
        computation.stop();

        if (error) {
          this.setState({
            photos: this.state.photos.map((photo) => {
              if (compareFiles(photo.file, localPhoto.file)) {
                return {
                  ...photo,
                  progress: `upload error: ${error.reason}`,
                  upload: null,
                };
              }
              return photo;
            }),
          });

          reject(error.reason);
        } else {
          this.setState({
            photos: this.state.photos.map((photo) => {
              if (compareFiles(photo.file, localPhoto.file)) {
                return {
                  ...photo,
                  url,
                  progress: null,
                  local: false,
                  upload: null,
                };
              }
              return photo;
            }),
          });

          resolve();
        }
      });
    });
  }

  render() {
    return (
      <StylistPortfolioPage
        photos={this.state.photos}
        pristine={this.state.pristine}
        saving={this.state.saving}
        onFilesSelected={this.handleFilesSelected}
        onPhotoDeleted={this.handlePhotoDeleted}
        onSave={this.handleSave}
      />
    );
  }
}

StylistPortfolio.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(StylistPortfolio);
