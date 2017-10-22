import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';

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
      Profiles.update({ owner: this.userId }, { $unset: { photo: '' } });

      // TODO: remove S3 files
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
