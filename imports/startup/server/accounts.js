import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import Profiles from '../../api/profiles/profiles';
import normalizeProfile from '../../modules/server/normalize-profile';
import { sendWelcomeEmail } from '../../modules/server/send-email';

// customize user account creation
// email registration and social sign-in will all come to here
Accounts.onCreateUser((options, user) => {
  const userToCreate = user;

  // keep a normalized user profile in a separate collection
  const normalizedProfile = normalizeProfile(options, user);
  if (normalizedProfile) {
    // TODO: conditionally update existing user profile data fields
    Profiles.upsert({ owner: normalizedProfile.owner }, { $set: normalizedProfile });

    // run tasks post creation
    // https://stackoverflow.com/questions/22649600/unable-to-add-roles-to-user-with-meteor-using-roles-package/22650399#22650399s

    // follow up actions after User record is saved
    Meteor.defer(() => {
      // set default user role as Customer
      Roles.addUsersToRoles(user._id, [Meteor.settings.private.roles.customer]);

      // send email verification for email/password registration
      if (user.services.password) {
        Accounts.sendVerificationEmail(user._id);
      }

      sendWelcomeEmail(normalizedProfile.email, normalizedProfile.name.first);
    });

    // keep name in User.profile for email-templates.js to use
    userToCreate.profile = { name: normalizedProfile.name };

    return userToCreate;
  }

  // TODO: test error handling in front-end
  throw new Error('something went wrong');
});
