import moment from 'moment-timezone';

// TODO: http://momentjs.com/guides/#/warnings/js-date/
export const dateString = (date, timezone = 'Australia/Melbourne') =>
  moment.tz(date, timezone).format('DD MMM YYYY');
export const dateTimeString = (date, timezone = 'Australia/Melbourne') =>
  moment.tz(date, timezone).format('DD MMM YYYY (ddd) HH:mm');

const urlQueryDateFormat = 'YYMMDD';
export const parseUrlQueryDate = (string, timezone = 'Australia/Melbourne') =>
  moment.tz(string, urlQueryDateFormat, timezone);
