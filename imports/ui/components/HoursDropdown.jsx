import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const hours = [
  { text: '00', value: 0 },
  { text: '01', value: 1 },
  { text: '02', value: 2 },
  { text: '03', value: 3 },
  { text: '04', value: 4 },
  { text: '05', value: 5 },
  { text: '06', value: 6 },
  { text: '07', value: 7 },
  { text: '08', value: 8 },
  { text: '09', value: 9 },
  { text: '10', value: 10 },
  { text: '11', value: 11 },
  { text: '12', value: 12 },
  { text: '13', value: 13 },
  { text: '14', value: 14 },
  { text: '15', value: 15 },
  { text: '16', value: 16 },
  { text: '17', value: 17 },
  { text: '18', value: 18 },
  { text: '19', value: 19 },
  { text: '20', value: 20 },
  { text: '21', value: 21 },
  { text: '22', value: 22 },
  { text: '23', value: 23 },
];

const HoursDropdown = ({ hour, onChange }) => (
  <Dropdown scrolling options={hours} value={hours[hour].value} onChange={onChange} />
);

HoursDropdown.defaultProps = {
  hour: 0,
};

HoursDropdown.propTypes = {
  hour: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default HoursDropdown;
