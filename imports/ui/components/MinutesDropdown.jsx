import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const minutes = [
  { text: '00', value: 0 },
  { text: '15', value: 15 },
  { text: '30', value: 30 },
  { text: '45', value: 45 },
];

const MinutesDropdown = ({ minute, onChange }) => (
  <Dropdown options={minutes} value={minutes[minute].value} onChange={onChange} />
);

MinutesDropdown.defaultProps = {
  minute: 0,
};

MinutesDropdown.propTypes = {
  minute: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};

export default MinutesDropdown;
