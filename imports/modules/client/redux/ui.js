import _ from 'lodash';

// --------- actions ----------
export function toggleSlideMenu(open = null) {
  return {
    type: 'UI_TOGGLE_SLIDE_MENU',
    open,
  };
}

export function toggleSideMenuMyBookings(open = null) {
  return {
    type: 'UI_TOGGLE_SIDE_MENU_MY_BOOKINGS',
    open,
  };
}

export function toggleSideMenuCustomerBookings(open = null) {
  return {
    type: 'UI_TOGGLE_SIDE_MENU_CUSTOMER_BOOKINGS',
    open,
  };
}

// --------- reducer ----------
const defaultState = {
  slideMenuOpen: false,
  sideMenuMyBookingsExpanded: false,
  sideMenuCustomerBookingsExpanded: false,
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

    case 'UI_TOGGLE_SIDE_MENU_MY_BOOKINGS': {
      const { open } = action;

      return {
        ...state,
        sideMenuMyBookingsExpanded: _.isNil(open) ? !state.sideMenuMyBookingsExpanded : open,
        sideMenuCustomerBookingsExpanded: false,
      };
    }

    case 'UI_TOGGLE_SIDE_MENU_CUSTOMER_BOOKINGS': {
      const { open } = action;

      return {
        ...state,
        sideMenuMyBookingsExpanded: false,
        sideMenuCustomerBookingsExpanded: _.isNil(open)
          ? !state.sideMenuCustomerBookingsExpanded
          : open,
      };
    }

    default:
      return state;
  }
};

export default reducer;
