import _ from 'lodash';
import queryString from 'query-string';

import { SEONameToServiceName, SEONameToSuburbName } from '../seo-name';

const parseSearchUrlParams = (props) => {
  const { service, suburb, postcode } = props.match.params;
  const { date, time } = queryString.parse(props.location.search);

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

  return {
    service: service && SEONameToServiceName(service),
    suburb: suburb && `${SEONameToSuburbName(suburb)}`,
    postcode,
    date,
    time: isTimeValid ? time : '',
  };
};

export default parseSearchUrlParams;
