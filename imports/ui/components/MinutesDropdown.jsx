import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';

const minutes = [
  { text: '00', value: 0 },
  { text: '15', value: 15 },
  { text: '30', value: 30 },
  { text: '45', value: 45 },
];

const MinutesDropdown = ({ minute, onChange, disabled }) => (
  <Dropdown options={minutes} value={minute} onChange={onChange} disabled={disabled} />
);

MinutesDropdown.defaultProps = {
  minute: 0,
};

MinutesDropdown.propTypes = {
  minute: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

export default MinutesDropdown;
