// --------- actions ----------
export function fetchProfile(fetching, profile) {
  return {
    type: 'PROFILE_FETCH',
    fetching,
    profile,
  };
}

// --------- reducer ----------
const defaultState = { fetching: false };

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_FETCH': {
      const { fetching, profile } = action;
      return {
        fetching,
        ...profile,
      };
    }

    default:
      return state;
  }
};

export default reducer;
