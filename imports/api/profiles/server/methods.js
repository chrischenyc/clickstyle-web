import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import log from 'winston';
import _ from 'lodash';

import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';
import Stylists from '../../stylists/stylists';
import Products from '../../products/products';
import Reviews from '../../reviews/reviews';
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
      const { name, address } = profileToUpdate;
      Stylists.update({ owner: this.userId }, { $set: { name, address } });

      log.info(
        'Meteor.methods: profiles.update',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(profile)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
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

      // denormalise photo data to Stylists record if it exists
      Stylists.update({ owner: this.userId }, { $set: { photo: URL } });

      log.info('Meteor.methods: profiles.photo.add', `userId: ${this.userId}`, `param: ${URL}`);
    } catch (exception) {
      log.error(exception);
      throw exception;
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

      // denormalise photo data to Stylists record if it exists
      Stylists.update({ owner: this.userId }, { $unset: { photo: '' } });

      log.info('Meteor.methods: profiles.photo.remove', `userId: ${this.userId}`);
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },

  'profiles.find': function usersProfile(owner) {
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
            averageRating: 1,
            reviewsCount: 1,
            portfolioPhotos: 1,
            owner: 1,
          },
        },
      );

      if (!_.isEmpty(stylist)) {
        // normalise reviews data
        let reviews = Reviews.find(
          { stylist: owner },
          {
            fields: {
              createdAt: 1,
              rating: 1,
              review: 1,
              customer: 1,
            },
            sort: {
              createdAt: -1,
            },
          },
        ).fetch();

        reviews = reviews.map((review) => {
          const customer = Profiles.findOne(
            { owner: review.customer },
            { fields: { owner: 1, name: 1, photo: 1 } },
          );
          return { ...review, customer };
        });

        stylist = { ...stylist, reviews };

        // normalise whether logged user has favoured this stylist
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
      log.error(exception);
      throw exception;
    }
  },

  'profiles.cards': function getSavedCards() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    const cards = [];

    const { stripeDefaultCardId, stripeDefaultCardLast4, stripeDefaultCardName } = Profiles.findOne({ owner: this.userId });

    if (stripeDefaultCardId && stripeDefaultCardLast4 && stripeDefaultCardName) {
      cards.push({
        id: stripeDefaultCardId,
        last4: stripeDefaultCardLast4,
        name: stripeDefaultCardName,
      });
    }

    return cards;
  },

  'profiles.card.remove': function removeSavedCard(id) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(id, String);

    const { stripeDefaultCardId } = Profiles.findOne({ owner: this.userId });

    if (stripeDefaultCardId === id) {
      Profiles.update(
        { owner: this.userId },
        {
          $unset: {
            stripeDefaultCardId: '',
            stripeDefaultCardLast4: '',
            stripeDefaultCardName: '',
          },
        },
      );
    }
  },

  'profiles.self': function profilesOwnerBasic() {
    if (!this.userId) {
      return null;
    }

    return Profiles.findOne(
      { owner: this.userId },
      {
        fields: {
          email: 1,
          name: 1,
          mobile: 1,
          address: 1,
          photo: 1,
          notifications: 1,
          about: 1,
          products: 1,
          stripeDefaultCardId: 1,
          stripeDefaultCardLast4: 1,
          stripeDefaultCardName: 1,
          owner: 1,
        },
      },
    );
  },

  'profiles.update.timezone': function profilesUpdateTimezone(timezone) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(timezone, String);

    try {
      Profiles.update({ owner: this.userId }, { $set: { timezone } });
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: [
    'profiles.update',
    'profiles.photo.add',
    'profiles.photo.remove',
    'profiles.find',
    'profiles.cards',
    'profiles.card.remove',
    'profiles.self',
    'profiles.update.timezone',
  ],
  limit: 5,
  timeRange: 1000,
});
