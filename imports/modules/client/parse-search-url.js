import queryString from 'query-string';

import { SEONameToServiceName, SEONameToSuburbName } from '../seo-name';
import isTimeQueryValid from '../validate-time-query';

const parseSearchUrlParams = (props) => {
  const { service, suburb, postcode } = props.match.params;
  const { date, time, duration } = queryString.parse(props.location.search);

  return {
    service: service && SEONameToServiceName(service),
    suburb: suburb && `${SEONameToSuburbName(suburb)}`,
    postcode,
    date,
    time: isTimeQueryValid(time) ? time : '',
    duration: parseInt(duration, 10),
  };
};

export default parseSearchUrlParams;
