import { Accounts } from 'meteor/accounts-base';
import Profiles from '../../api/profiles/profiles';
import normalizeProfile from '../../modules/server/normalize-profile';

// customize user account creation
// email registration and social sign-in will all come to here
Accounts.onCreateUser((options, user) => {
  const userToCreate = user;

  // save user profile data in a separate collection - Profiles
  // only leave minimal foot print in Meteor.users collection
  const normalizedProfile = normalizeProfile(options, user);
  if (normalizedProfile) {
    Profiles.upsert({ owner: normalizedProfile.owner }, { $set: normalizedProfile });

    userToCreate.profile = { name: normalizedProfile.name };

    return userToCreate;
  }

  throw new Error('something went wrong');
});
