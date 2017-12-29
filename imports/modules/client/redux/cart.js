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
    type: 'SELECT_STYLIST',
    stylist,
  };
}

export function selectService(stylist, service, addon = null) {
  return {
    type: 'SELECT_SERVICE',
    stylist,
    service,
    addon,
  };
}

export function deleteService(service) {
  return {
    type: 'DELETE_SERVICE',
    service,
  };
}

export function deleteAddon(service, addon) {
  return {
    type: 'DELETE_ADDON',
    service,
    addon,
  };
}

// --------- reducer ----------
const defaultState = {
  stylist: null,
  services: [],
  total: 0,
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SELECT_STYLIST': {
      const { stylist } = action;

      if (_.isNil(state.stylist) || state.stylist.owner !== stylist.owner) {
        // reset cart if different stylist is selected
        return { ...defaultState, stylist: { _id: stylist._id, owner: stylist.owner } };
      }

      return state;
    }

    case 'SELECT_SERVICE': {
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

    case 'DELETE_SERVICE': {
      const { service } = action;

      const services = state.services.filter(s => s._id !== service._id);

      return { ...state, services, total: calculateTotal(services) };
    }

    case 'DELETE_ADDON': {
      const { service, addon } = action;

      const services = state.services.map((s) => {
        if (s._id === service._id) {
          return { ...s, addons: s.addons.filter(a => a._id !== addon._id) };
        }
        return s;
      });

      return { ...state, services, total: calculateTotal(services) };
    }

    default:
      return state;
  }
};

export default reducer;
