import './products';
import './services';
import './suburbs';
import './featured';

import Stylists from '../../../api/stylists/stylists';

const stylists = Stylists.find({ openHours: { $exists: true, $not: { $size: 0 } } }).fetch();
stylists.forEach((stylist) => {
  const { openHours } = stylist;

  const newOpenHours = [];

  openHours.forEach((openHour) => {
    const {
      day, open, openAtHour, openAtMinute, closeAtHour, closeAtMinute,
    } = openHour;
    const newOpenHour = {
      day,
      open,
      openAt: `${openAtHour.toString().padStart(2, '0')}:${openAtMinute
        .toString()
        .padStart(2, '0')}`,
      closeAt: `${closeAtHour.toString().padStart(2, '0')}:${closeAtMinute
        .toString()
        .padStart(2, '0')}`,
    };

    newOpenHours.push(newOpenHour);
  });

  Stylists.update({ _id: stylist._id }, { $set: { openHours: newOpenHours } });
});
