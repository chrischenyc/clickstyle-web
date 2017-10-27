import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';
import Brands from '../../brands/brands';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';

Meteor.methods({
  'profiles.update': function profilesUpdate(profile) {
    check(profile, Object);

    try {
      // screen invalid products input
      // create new Brands object if profile.products contains object(s) without brand id
      const profileToUpdate = profile;

      if (profileToUpdate.products) {
        profileToUpdate.products = profileToUpdate.products
          .filter(product => product.name && product.name.length > 0)
          .map((product) => {
            if (product.brand) {
              // existing product
              return product;
            }

            // insert new Brand if it doesn't exist
            const existingBrand = Brands.findOne({ name: product.name });
            if (existingBrand) {
              return { brand: existingBrand._id, name: product.name };
            }

            const brand = Brands.insert({ name: product.name, system: false });
            return { brand, name: product.name };
          });
      }

      Profiles.update({ owner: this.userId }, { $set: profileToUpdate });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'profiles.photo.add': function profilesPhotoAdd(URL) {
    check(URL, String);

    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove current profile photo from cloud
      if (profile.photo && profile.photo.origin) {
        deleteCloudinaryFile(profile.photo.origin, (error) => {
          if (error) {
            /* eslint-disable no-console */
            console.error(`Unable to delete cloudinary file: ${profile.photo.origin}`);
            console.error(error);
            /* eslint-enable no-console */
          }
        });
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $set: { photo: { origin: URL } } });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'profiles.photo.remove': function profilesPhotoRemove() {
    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove profile photo from cloud
      if (profile.photo && profile.photo.origin) {
        deleteCloudinaryFile(profile.photo.origin, (error) => {
          if (error) {
            /* eslint-disable no-console */
            console.error(`Unable to delete cloudinary file: ${profile.photo.origin}`);
            console.error(error);
            /* eslint-enable no-console */
          }
        });
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $unset: { photo: '' } });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['profiles.update', 'profiles.photo.add', 'profiles.photo.remove'],
  limit: 5,
  timeRange: 1000,
});
