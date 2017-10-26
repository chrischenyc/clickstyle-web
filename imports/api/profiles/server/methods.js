import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';

Meteor.methods({
  'profiles.update': function profilesUpdate(profile) {
    check(profile, Object);

    try {
      Profiles.update({ owner: this.userId }, { $set: profile });
    } catch (exception) {
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
            console.log(`Unable to delete cloudinary file: ${profile.photo.origin}`);
            console.log(error);
            /* eslint-enable no-console */
          }
        });
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $set: { photo: { origin: URL } } });
    } catch (exception) {
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
            console.log(`Unable to delete cloudinary file: ${profile.photo.origin}`);
            console.log(error);
            /* eslint-enable no-console */
          }
        });
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $unset: { photo: '' } });
    } catch (exception) {
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['profiles.update', 'profiles.photo.add', 'profiles.photo.remove'],
  limit: 5,
  timeRange: 1000,
});
