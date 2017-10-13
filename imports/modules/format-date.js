import moment from 'moment';

const formatDate = date => moment(date).format('D MMMM YYYY');

export default formatDate;
