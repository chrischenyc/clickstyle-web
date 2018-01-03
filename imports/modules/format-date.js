import moment from 'moment';

export const dateDisplayFormat = 'DD MMM YYYY';
export const formatDateDisplayString = date => moment(date).format(dateDisplayFormat);

export const formatMonthYear = date => moment(date).format('MMMM YYYY');
export const formatFileTimestamp = date => moment(date).format('YYYYMMDDHHmmss');

export const urlQueryFormat = 'YYYY-MM-DD';
export const formatDateQueryString = date => moment(date).format(urlQueryFormat);
export const parseDateQueryString = string => moment(string, urlQueryFormat);
export const weekdayOfDateQueryString = string => moment(string, urlQueryFormat).weekday();

export const dayOfWeekAsString = dayIndex =>
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex - 1];
