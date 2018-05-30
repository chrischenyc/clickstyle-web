import moment from 'moment';

// TODO: http://momentjs.com/guides/#/warnings/js-date/
export const dateString = date => moment(date).format('DD MMM YYYY');
export const dateTimeString = date => moment(date).format('DD MMM YYYY (ddd) HH:mm');
export const yearString = date => moment(date).format('YYYY');
export const monthYearString = date => moment(date).format('MMMM YYYY');

const urlQueryDateFormat = 'YYMMDD';
export const urlQueryDateString = date => moment(date).format(urlQueryDateFormat);
export const parseUrlQueryDate = string => moment(string, urlQueryDateFormat);

export const weekdayString = dayIndex =>
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex - 1];
