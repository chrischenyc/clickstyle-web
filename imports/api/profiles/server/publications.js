import { Meteor } from 'meteor/meteor';
import Profiles from '../profiles';

Meteor.publish('profiles.owner', function profilesOwner() {
  if (!this.userId) {
    return null;
  }

  return Profiles.find(
    { owner: this.userId },
    {
      // hide fields in the return
      fields: { createdAt: 0, updatedAt: 0 },
    },
  );
});
