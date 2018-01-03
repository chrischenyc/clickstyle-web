import { parseDateQueryString } from './format-date';

import isTimeQueryValid from './validate-time-query';

/**
 *
 * @param {Stylists object} stylist
 * @param {date string, format: YYYY-MM-DD} date
 * @param {time string, format: HH:mm} time
 */
const isStylistAvailable = (stylist, date, time) => {
  const isDateValid = parseDateQueryString(date).isValid();
  const isTimeValid = isTimeQueryValid(time);

  if (isDateValid && isTimeQueryValid) {
    return true;
  } else if (isDateValid) {
    return true;
  } else if (isTimeValid) {
    return true;
  }

  return true;
};

export default isStylistAvailable;
