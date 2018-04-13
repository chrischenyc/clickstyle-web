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
        email: 1,
        name: 1,
        mobile: 1,
        address: 1,
        photo: 1,
        notifications: 1,
        stripeDefaultCardId: 1,
        stripeDefaultCardLast4: 1,
        stripeDefaultCardName: 1,
      },
    },
  );
});
