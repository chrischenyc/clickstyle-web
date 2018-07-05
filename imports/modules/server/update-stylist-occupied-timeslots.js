import moment from 'moment';
import _ from 'lodash';

import Stylists from '../../api/stylists/stylists';

// stylists.occupiedTimeSlots.from: 1801010000 ~ 1801012359 (int)
// stylists.occupiedTimeSlots.to: 1801010000 ~ 1801012359 (int)
// stylists.occupiedTimeSlots.state: 'booked' | 'closed' | 'scheduled' (string)
const updateStylistOccupiedTimeSlots = (owner, days) => {
  const stylist = Stylists.findOne({ owner });
  const { occupiedTimeSlots, openHours } = stylist;

  // clean up existing recurring occupied time slots

  let newOccupiedTimeSlots = _.isEmpty(occupiedTimeSlots)
    ? []
    : occupiedTimeSlots.filter(t => !(t.state === 'closed'));

  for (let index = 0; index < days; index += 1) {
    const timeSlotsOfDay = [];

    const day = moment().add(index, 'd');
    let weekDay = day.weekday();
    if (weekDay === 0) {
      weekDay = 7; // in our system Sunday is 7, in moment.js Sunday is 0
    }
    const openHour = openHours.filter(o => o.day === weekDay)[0];

    const dateInNumber = parseInt(day.format('YYMMDD'), 10) * 10000;

    if (!openHour.open) {
      // if closed, fill the day with a single occupied time slot, YYMMDD0000 - YYMMDD2359
      timeSlotsOfDay.push({
        from: dateInNumber,
        to: dateInNumber + 2359,
        state: 'closed',
      });
    } else {
      // else, fill the day with occupied time slots before/after open/close time
      const openHourInNumber = parseInt(openHour.openAt.split(':')[0], 10);
      const openMinuteInNumber = parseInt(openHour.openAt.split(':')[1], 10);
      const closeHourInNumber = parseInt(openHour.closeAt.split(':')[0], 10);
      const closeMinuteInNumber = parseInt(openHour.closeAt.split(':')[1], 10);

      if (!(openHourInNumber === 0 && openMinuteInNumber === 0)) {
        if (openMinuteInNumber > 0) {
          timeSlotsOfDay.push({
            from: dateInNumber,
            to: dateInNumber + openHourInNumber * 100 + openMinuteInNumber - 1,
            state: 'closed',
          });
        } else {
          timeSlotsOfDay.push({
            from: dateInNumber,
            to: dateInNumber + (openHourInNumber - 1) * 100 + 59,
            state: 'closed',
          });
        }
      }

      if (!(closeHourInNumber === 23 && closeMinuteInNumber === 59)) {
        if (closeMinuteInNumber < 59) {
          timeSlotsOfDay.push({
            from: dateInNumber + closeHourInNumber * 100 + closeMinuteInNumber + 1,
            to: dateInNumber + 2359,
            state: 'closed',
          });
        } else {
          timeSlotsOfDay.push({
            from: dateInNumber + (closeHourInNumber + 1) * 100,
            to: dateInNumber + 2359,
            state: 'closed',
          });
        }
      }
    }

    // merge day's time slots back to master array
    newOccupiedTimeSlots = [...newOccupiedTimeSlots, ...timeSlotsOfDay];
  }

  newOccupiedTimeSlots = _.uniq(newOccupiedTimeSlots);

  // update record
  Stylists.update({ owner }, { $set: { occupiedTimeSlots: newOccupiedTimeSlots } });
};

export default updateStylistOccupiedTimeSlots;
