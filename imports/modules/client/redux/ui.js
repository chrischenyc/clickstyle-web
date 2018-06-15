import _ from 'lodash';

// --------- actions ----------
export function toggleSlideMenu(open = null) {
  return {
    type: 'UI_TOGGLE_SLIDE_MENU',
    open,
  };
}

export function setNextRoute(nextRoute) {
  return {
    type: 'UI_NEXT_ROUTE',
    nextRoute,
  };
}

// --------- reducer ----------
const defaultState = {
  slideMenuOpen: false,
  nextRoute: null,
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

    case 'UI_NEXT_ROUTE': {
      const { nextRoute } = action;

      return {
        ...state,
        nextRoute,
      };
    }

    default:
      return state;
  }
};

export default reducer;
