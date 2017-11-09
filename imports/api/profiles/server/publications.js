import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Profiles from '../profiles';

Meteor.publish('profiles.owner', function profilesOwner() {
  if (!this.userId) {
    return null;
  }

  return Profiles.find(
    { owner: this.userId },
    {
      // hide fields in the return
      fields: { owner: 0, createdAt: 0, updatedAt: 0 },
    },
  );
});

Meteor.publish('profiles', (_id) => {
  if (!this.userId) {
    return null;
  }

  check(_id, String);

  return Profiles.find(
    { _id },
    {
      fields: {
        owner: 1,
        email: 1,
        name: 1,
        mobile: 1,
        about: 1,
        photo: 1,
        products: 1,
        stylist: 1,
      },
    },
  );
});
