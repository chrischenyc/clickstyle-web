import React from 'react';
import PropTypes from 'prop-types';

import { dayOfWeekAsString } from '../../../modules/format-date';
import OpenHourString from '../../../modules/client/OpenHourString';

const StylistHoursSection = props => (
  <div className="boxed-widget opening-hours">
    <h3>
      <i className="sl sl-icon-clock" /> Opening Hours
    </h3>
    <ul>
      {props.openHours.map(openHour => (
        <li key={openHour.day}>
          {dayOfWeekAsString(openHour.day)}
          <span>{OpenHourString(openHour)}</span>
        </li>
      ))}
    </ul>
  </div>
);

StylistHoursSection.propTypes = {
  openHours: PropTypes.array.isRequired,
};

export default StylistHoursSection;
