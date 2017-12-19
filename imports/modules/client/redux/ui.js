import _ from 'lodash';

// --------- actions ----------
export function toggleSlideMenu(open = null) {
  return {
    type: 'TOGGLE_SLIDE_MENU',
    open,
  };
}

// --------- reducer ----------
const defaultState = {
  openSlideMenu: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_SLIDE_MENU': {
      const { open } = action;

      return {
        ...state,
        openSlideMenu: _.isNil(open) ? !state.openSlideMenu : open,
      };
    }

    default:
      return state;
  }
};

export default reducer;
