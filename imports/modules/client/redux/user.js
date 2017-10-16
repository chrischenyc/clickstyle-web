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

// --------- reducer ----------
const defaultState = {
  authenticated: localStorage.getItem('Meteor.userId') !== null,
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'USER_SIGNED_IN': {
      const { meteorUser } = action;

      const _id = meteorUser && meteorUser._id;
      let verified = true;
      if (meteorUser && meteorUser.emails && meteorUser.emails.length > 0) {
        verified = meteorUser.emails[0].verified;
      }

      return {
        ...state,
        authenticated: _id && true,
        verified,
      };
    }

    case 'USER_SIGNED_OUT': {
      return {
        ...state,
        authenticated: false,
      };
    }

    default:
      return state;
  }
};

export default userReducer;
