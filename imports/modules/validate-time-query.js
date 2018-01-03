import _ from 'lodash';

const isTimeQueryValid = (time) => {
  let isTimeValid = true;

  if (_.isNil(time)) {
    isTimeValid = false;
  } else if (time.indexOf(':') === -1) {
    isTimeValid = false;
  } else {
    const parts = time.split(':');
    if (parts.length !== 2) {
      isTimeValid = false;
    } else if (parseInt(parts[0]) < 0 || parseInt(parts[0]) > 23) {
      // validate hour
      isTimeValid = false;
    } else if (parseInt(parts[1]) < 0 || parseInt(parts[1]) > 59) {
      // validate minute
      isTimeValid = false;
    }
  }

  return isTimeValid;
};

export default isTimeQueryValid;
