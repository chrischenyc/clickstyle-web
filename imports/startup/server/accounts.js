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
    Profiles.insert({
      ...normalizedProfile,
      notifications: 0,
      messages: 0,
      confirmedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      declinedBookings: 0,
      completedBookings: 0,
      confirmedCustomerBookings: 0,
      pendingCustomerBookings: 0,
      cancelledCustomerBookings: 0,
      declinedCustomerBookings: 0,
      completedCustomerBookings: 0,
    });

    userToCreate.profile = { name: normalizedProfile.name };

    return userToCreate;
  }

  throw new Error('something went wrong');
});
