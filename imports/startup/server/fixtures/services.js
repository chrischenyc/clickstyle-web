import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';

const services = require('../../../modules/services-addons.json');

// seed Services and Addons data if database is empty
if (Services.find().fetch().length === 0) {
  for (let index = 0; index < services.length; index += 1) {
    const service = services[index];

    const serviceId = Services.insert({
      name: service.name,
      displayOrder: index,
    });

    service.addons.forEach((addon) => {
      Addons.insert({
        serviceId,
        name: addon.name,
        createdBy: 'system',
        public: true,
      });
    });
  }
}
