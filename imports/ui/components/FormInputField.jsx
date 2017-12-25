import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import _ from 'lodash';

export const FormFieldNote = ({ note }) => {
  if (_.isEmpty(note)) {
    return '';
  }

  return <p style={{ marginTop: '-0.75rem', marginBottom: '1rem', color: '#aaa' }}>{note}</p>;
};

FormFieldNote.propTypes = {
  note: PropTypes.string.isRequired,
};

export const FormFieldErrorMessage = ({ message, ...rest }) => {
  if (_.isEmpty(message)) {
    return '';
  }

  return (
    <div className="notification error" {...rest}>
      {message}
    </div>
  );
};

FormFieldErrorMessage.defaultProps = {
  message: '',
};

FormFieldErrorMessage.propTypes = {
  message: PropTypes.string,
};

export const FormInputField = ({
  name, onChange, errors, note, ...rest
}) => (
  <Form.Field>
    <Form.Input name={name} onChange={onChange} error={!_.isEmpty(errors[name])} {...rest} />
    <FormFieldErrorMessage
      message={errors[name]}
      style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
    />
    <FormFieldNote note={note} />
  </Form.Field>
);

FormInputField.defaultProps = {
  note: '',
};

FormInputField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  note: PropTypes.string,
};

export const PriceField = ({ onChange, ...rest }) => (
  <Input
    type="number"
    min="1"
    onChange={onChange}
    onBlur={(event) => {
      const price = parseInt(event.target.value);
      if (price <= 0) {
        onChange({ target: { name: event.target.name, value: '' } });
      }
    }}
    {...rest}
  />
);

PriceField.propTypes = {
  onChange: PropTypes.func.isRequired,
};
