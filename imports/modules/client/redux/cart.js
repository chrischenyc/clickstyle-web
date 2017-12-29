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

        if (!_.isNil(addon)) {
          // new addon is provided, we need to evaluate it
          let addonMatched = false;

          let newAddons = currentService.addons
            .map((currentAddon) => {
              if (currentAddon._id === addon._id) {
                // addon has been selected, remove it from data structure
                addonMatched = true;

                return null;
              }
              return currentAddon;
            })
            .filter(currentAddon => !_.isNil(currentAddon));

          if (!addonMatched) {
            // addon hasn't been selected, add it to data structure
            newAddons = [...newAddons, addon];
          }

          return { ...currentService, addons: newAddons };
        }

        // new addon is null, deselect selected service only if it has no addons
        if (currentService.addons.length === 0) {
          return null;
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

// --------- reducer ----------
const defaultState = {
  stylist: null,
  services: [],
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
        return {
          ...defaultState,
          stylist: { _id: stylist._id, owner: stylist.owner },
          services: updateServices([], service, addon),
        };
      }

      return { ...state, services: updateServices(state.services, service, addon) };
    }

    default:
      return state;
  }
};

export default reducer;
