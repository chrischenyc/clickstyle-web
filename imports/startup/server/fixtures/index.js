import './products';
import './services';
import './suburbs';
import './featured';

import Stylists from '../../../api/stylists/stylists';

const stylists = Stylists.find().fetch();

stylists.forEach((stylist) => {
  if (stylist.services) {
    const services = stylist.services.map((service) => {
      const addons = service.addons && service.addons.map(addon => ({ ...addon, duration: 30 }));

      return { ...service, baseDuration: 60, addons };
    });

    Stylists.update({ _id: stylist._id }, { $set: { services } });
  }
});
