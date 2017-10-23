import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';
import deleteS3File from '../../../modules/server/delete-S3-file';

Meteor.methods({
  'profiles.update': function profilesUpdate(profile) {
    check(profile, Object);

    try {
      Profiles.update({ owner: this.userId }, { $set: profile });
    } catch (exception) {
      throw new Meteor.Error('500');
    }
  },
  'profiles.photo.remove': function profilesPhotoRemove() {
    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove S3 files
      deleteS3File(profile.photo.origin, (error) => {
        if (error) {
          console.log(`Unable to delete S3 file: ${profile.photo.origin}`);
        }
      });

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $unset: { photo: '' } });
    } catch (exception) {
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['profiles.update', 'profiles.photo.remove'],
  limit: 5,
  timeRange: 1000,
});
