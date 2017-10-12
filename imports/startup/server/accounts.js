import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import Profiles from '../../api/profiles/profiles';
import normalizeProfile from '../../modules/normalize-profile';

// customize user account creation
// email registration and social sign-in will all come to here
Accounts.onCreateUser((options, user) => {
  const userToCreate = user;

  // TODO: server-side params validation

  // keep a normalized user profile in a separate collection
  const normalizedProfile = normalizeProfile(options, user);
  if (normalizedProfile) {
    // TODO: conditionally update existing user profile data fields
    Profiles.upsert({ owner: normalizedProfile.owner }, { $set: normalizedProfile });
  }

  // run tasks post creation
  // https://stackoverflow.com/questions/22649600/unable-to-add-roles-to-user-with-meteor-using-roles-package/22650399#22650399s

  Meteor.defer(() => {
    // set default user role as Customer
    Roles.addUsersToRoles(user._id, ['customer']);

    // send email verification for email/password registration
    if (user.services.password) {
      Accounts.sendVerificationEmail(user._id);
    }

    // TODO: sendWelcomeEmail(options, user);
  });

  return userToCreate;
});
