import _ from 'lodash';

const servicesKeywordMatch = (services, keyword) =>
  services.filter((service) => {
    if (!_.isEmpty(keyword)) {
      if (service.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
        return true;
      }

      let addonMatched = false;
      service.addons.some((addon) => {
        if (addon.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          addonMatched = true;
        }

        return addonMatched;
      });

      return addonMatched;
    }

    return true;
  });

export default servicesKeywordMatch;
