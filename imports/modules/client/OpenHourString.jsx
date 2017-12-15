import { dayOfWeekAsString } from '../../modules/format-date';

function paddingLeft(string, paddingValue) {
  return String(paddingValue + string).slice(-paddingValue.length);
}

const OpenHourString = openHour =>
  `${dayOfWeekAsString(openHour.day)}: ${
    openHour.open
      ? `${openHour.openAtHour}:${paddingLeft(openHour.openAtMinute, '00')} - ${
        openHour.closeAtHour
      }:${paddingLeft(openHour.closeAtMinute, '00')}`
      : 'closed'
  }`;

export default OpenHourString;
