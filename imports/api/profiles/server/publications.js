import { Meteor } from 'meteor/meteor';
import Profiles from '../profiles';

Meteor.publish('profiles.self', function profilesOwner() {
  if (!this.userId) {
    return null;
  }

  return Profiles.find(
    { owner: this.userId },
    {
      fields: {
        name: 1,
        mobile: 1,
        address: 1,
        photo: 1,
        notifications: 1,
      },
    },
  );
});
