import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';
import Stylists from '../../stylists/stylists';
import Products from '../../products/products';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';

Meteor.methods({
  'profiles.update': function profilesUpdate(profile) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(profile, Object);

    try {
      // screen invalid products input
      // create new Products object if profile.products contains object(s) without .productId
      const profileToUpdate = profile;

      if (profileToUpdate.products) {
        profileToUpdate.products = profileToUpdate.products
          .filter(product => product.name && product.name.length > 0)
          .map((product) => {
            if (product.productId) {
              // existing product
              return product;
            }

            // insert new Product if it doesn't exist
            // case insensitive search: https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            const existingProduct = Products.findOne({
              name: { $regex: new RegExp(product.name, 'i') },
            });
            if (existingProduct) {
              return { productId: existingProduct._id, name: product.name };
            }

            const productId = Products.insert({
              name: product.name,
              system: false,
            });
            return { productId, name: product.name };
          });
      }

      Profiles.update({ owner: this.userId }, { $set: profileToUpdate });

      // denormalise some data to Stylists record if it exists
      const { name, photo, address } = profileToUpdate;
      Stylists.update({ owner: this.userId }, { $set: { name, photo, address } });

      log.info(
        'Meteor.methods: profiles.update',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(profile)}`,
      );
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'profiles.photo.add': function profilesPhotoAdd(URL) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(URL, String);

    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove current profile photo from cloud
      if (profile.photo) {
        deleteCloudinaryFile(profile.photo);
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $set: { photo: URL } });

      log.info('Meteor.methods: profiles.photo.add', `userId: ${this.userId}`, `param: ${URL}`);
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'profiles.photo.remove': function profilesPhotoRemove() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove profile photo from cloud
      if (profile.photo) {
        deleteCloudinaryFile(profile.photo);
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $unset: { photo: '' } });

      log.info('Meteor.methods: profiles.photo.remove', `userId: ${this.userId}`);
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'users.profile': function usersProfile(owner) {
    check(owner, String);

    try {
      const profile = Profiles.findOne(
        { owner },
        {
          fields: {
            address: 1,
            name: 1,
            photo: 1,
            products: 1,
            about: 1,
            createdAt: 1,
            owner: 1,
          },
        },
      );
      let stylist = Stylists.findOne(
        { owner, published: true },
        {
          fields: {
            openHours: 1,
            services: 1,
            favourites: 1,
            reviews: 1,
            averageRating: 1,
            portfolioPhotos: 1,
            owner: 1,
          },
        },
      );

      if (!_.isEmpty(stylist)) {
        // normalise data

        if (stylist.reviews) {
          stylist.reviews = stylist.reviews.map((review) => {
            const reviewer = Profiles.findOne(
              { owner: review.reviewer },
              { fields: { owner: 1, name: 1, photo: 1 } },
            );
            return { ...review, reviewer };
          });
        }

        if (this.userId) {
          const { favouredStylists } = Profiles.findOne({ owner: this.userId });

          stylist = {
            ...stylist,
            favoured: favouredStylists && favouredStylists.indexOf(owner) !== -1,
          };
        }
      }

      return {
        profile,
        stylist,
      };
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['profiles.update', 'profiles.photo.add', 'profiles.photo.remove', 'users.profile'],
  limit: 5,
  timeRange: 1000,
});
