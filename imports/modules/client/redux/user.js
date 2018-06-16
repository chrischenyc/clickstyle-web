import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

// --------- actions ----------
export function userSignedIn(meteorUser) {
  return {
    type: 'USER_SIGNED_IN',
    meteorUser,
  };
}

export function userSignedOut() {
  return {
    type: 'USER_SIGNED_OUT',
  };
}

export function userProfileFetched(profile) {
  return {
    type: 'USER_PROFILE_FETCHED',
    profile,
  };
}

// --------- reducer ----------
const defaultState = {
  authenticated: localStorage.getItem('Meteor.userId') !== null,
  isStylist: localStorage.getItem('clickstyle.isStylist') || false,
  profile: {},
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'USER_SIGNED_IN': {
      const { meteorUser } = action;

      const isStylist =
        meteorUser && Roles.userIsInRole(meteorUser._id, Meteor.settings.public.roles.stylist);
      localStorage.setItem('clickstyle.isStylist', isStylist);

      return {
        ...state,
        id: meteorUser._id,
        authenticated: meteorUser && true,
        verified:
          meteorUser &&
          meteorUser.emails &&
          meteorUser.emails.length > 0 &&
          meteorUser.emails[0].verified,
        isStylist,
      };
    }

    case 'USER_SIGNED_OUT': {
      localStorage.setItem('clickstyle.isStylist', false);

      return {
        authenticated: false,
        profile: {},
      };
    }

    case 'USER_PROFILE_FETCHED': {
      const { profile } = action;

      return {
        ...state,
        profile,
      };
    }

    default:
      return state;
  }
};

export default reducer;
