import _ from 'lodash';

// --------- actions ----------
export function toggleSlideMenu(open = null) {
  return {
    type: 'UI_TOGGLE_SLIDE_MENU',
    open,
  };
}

// --------- reducer ----------
const defaultState = {
  slideMenuOpen: false,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'UI_TOGGLE_SLIDE_MENU': {
      const { open } = action;

      return {
        ...state,
        slideMenuOpen: _.isNil(open) ? !state.slideMenuOpen : open,
      };
    }

    default:
      return state;
  }
};

export default reducer;
