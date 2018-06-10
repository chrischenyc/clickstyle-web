import _ from 'lodash';

// --------- actions ----------
export function toggleSlideMenu(open = null) {
  return {
    type: 'UI_TOGGLE_SLIDE_MENU',
    open,
  };
}

export function openModal(modalComponent, modalTitle, modalDismissible = true) {
  return {
    type: 'UI_MODAL_OPEN',
    modalComponent,
    modalTitle,
    modalDismissible,
  };
}

export function closeModal() {
  return {
    type: 'UI_MODAL_CLOSE',
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
  modalOpen: false,
  modalComponent: null,
  modalTitle: null,
  modalDismissible: true,
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

    case 'UI_MODAL_OPEN': {
      const { modalComponent, modalTitle, modalDismissible } = action;

      return {
        ...state,
        modalOpen: true,
        modalComponent,
        modalTitle,
        modalDismissible,
      };
    }

    case 'UI_MODAL_CLOSE': {
      return {
        ...state,
        modalOpen: false,
        modalComponent: null,
        modalTitle: null,
        modalDismissible: true,
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
