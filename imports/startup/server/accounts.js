import { Accounts } from 'meteor/accounts-base';
import Profiles from '../../api/profiles/profiles';
import normalizeProfile from '../../helpers/normalize-profile';

// customize user account creation
// email registration and social sign-in will all come to here
Accounts.onCreateUser((options, user) => {
  const userToCreate = user;

  // keep user profile in a separate collection
  const normalizedProfile = normalizeProfile(options, user);

  if (normalizedProfile) {
    Profiles.upsert({ userId: normalizedProfile.userId }, { $set: normalizedProfile });
  }

  // TODO: set default user role to Customer

  // TODO: send email verification for email/password registration

  // TODO: sendWelcomeEmail(options, user);

  return userToCreate;
});
