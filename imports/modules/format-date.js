import moment from 'moment';

export const formatYear = date => moment(date).format('YYYY');
export const formatDate = date => moment(date).format('D MMMM YYYY');
export const formatDateTime = date => moment(date).format('D MMMM YYYY, HH:mm');
export const formatFileTimestamp = date => moment(date).format('YYYYMMDDHHmmss');

export const dayOfWeekAsString = dayIndex =>
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayIndex - 1];
