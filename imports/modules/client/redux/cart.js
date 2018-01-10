import _ from 'lodash';

/**
 * update current selected services data
 *
 * @param {current selected services} currentServices
 * @param {newly selected service} service
 * @param {newly selected addon, optional} addon
 */
const updateServices = (currentServices, service, addon = null) => {
  let serviceMatched = false;

  let newServices = currentServices
    .map((currentService) => {
      if (currentService._id === service._id) {
        // service has been selected
        serviceMatched = true;

        if (
          !_.isNil(addon) &&
          currentService.addons.filter(currentAddon => currentAddon._id === addon._id).length === 0
        ) {
          // new addon hasn't been selected, insert it
          return { ...currentService, addons: [...currentService.addons, addon] };
        }

        // otherwise, do nothing
        return currentService;
      }

      return currentService;
    })
    .filter(currentService => !_.isNil(currentService));

  if (!serviceMatched) {
    newServices = [...newServices, { ...service, addons: _.isNil(addon) ? [] : [addon] }];
  }

  return newServices;
};

const calculateTotal = (services) => {
  let total = 0;

  services.forEach((service) => {
    total += service.basePrice;

    service.addons.forEach((addon) => {
      total += addon.price;
    });
  });

  return total;
};

// --------- actions ----------
export function selectStylist(stylist) {
  return {
    type: 'CART_SELECT_STYLIST',
    stylist,
  };
}

export function selectService(stylist, service, addon = null) {
  return {
    type: 'CART_SELECT_SERVICE',
    stylist,
    service,
    addon,
  };
}

export function deleteService(service) {
  return {
    type: 'CART_DELETE_SERVICE',
    service,
  };
}

export function deleteAddon(service, addon) {
  return {
    type: 'CART_DELETE_ADDON',
    service,
    addon,
  };
}

export function setUserInfo(info) {
  return {
    type: 'CART_SET_USER_INFO',
    info,
  };
}

// --------- reducer ----------
const defaultState = {
  stylist: null,
  services: [],
  total: 0,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  date: '',
  time: '',
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'CART_SELECT_STYLIST': {
      const { stylist } = action;

      // reset cart if no stylist was previously selected or a different stylist is selected
      if (_.isNil(state.stylist) || state.stylist.owner !== stylist.owner) {
        return {
          ...defaultState,
          stylist: { owner: stylist.owner, name: stylist.name, address: stylist.address },
        };
      }

      return state;
    }

    case 'CART_SELECT_SERVICE': {
      const { stylist, service, addon } = action;

      if (_.isNil(state.stylist) || state.stylist.owner !== stylist.owner) {
        // reset cart if different stylist is selected
        const services = updateServices([], service, addon);
        return {
          ...defaultState,
          stylist: { _id: stylist._id, owner: stylist.owner },
          services,
          total: calculateTotal(services),
        };
      }

      const services = updateServices(state.services, service, addon);
      return { ...state, services, total: calculateTotal(services) };
    }

    case 'CART_DELETE_SERVICE': {
      const { service } = action;

      const services = state.services.filter(s => s._id !== service._id);

      return { ...state, services, total: calculateTotal(services) };
    }

    case 'CART_DELETE_ADDON': {
      const { service, addon } = action;

      const services = state.services.map((s) => {
        if (s._id === service._id) {
          return { ...s, addons: s.addons.filter(a => a._id !== addon._id) };
        }
        return s;
      });

      return { ...state, services, total: calculateTotal(services) };
    }

    case 'CART_SET_USER_INFO': {
      const { info } = action;

      return { ...state, ...info };
    }

    default:
      return state;
  }
};

export default reducer;
