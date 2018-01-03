import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Search } from 'semantic-ui-react';

// TODO: support exclusive hours
const timeOptions = () => {
  const options = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 59; minute += 15) {
      const hourString = hour.toString().padStart(2, '0');
      const minuteString = minute.toString().padStart(2, '0');
      options.push({ title: `${hourString}:${minuteString}` });
    }
  }

  return options;
};

class TimeInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: props.optional ? [{ title: 'Any time' }, ...timeOptions()] : timeOptions(),
      value: '',
    };
  }

  render() {
    const {
      time, optional, onChange, ...rest
    } = this.props;

    return (
      <Search
        input={<input type="text" />}
        results={this.state.results}
        value={this.state.value}
        minCharacters={0}
        onResultSelect={(e, { result }) => {
          if (optional && result.title === 'Any time') {
            this.setState({ value: '' });
            onChange('');
          } else {
            const value = result.title;
            this.setState({ value });
            onChange(value);
          }
        }}
        {...rest}
      />
    );
  }
}

TimeInput.defaultProps = {
  time: null,
  optional: false,
};

TimeInput.propTypes = {
  time: PropTypes.number,
  optional: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default TimeInput;
