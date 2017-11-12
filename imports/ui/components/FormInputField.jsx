import React from 'react';
import PropTypes from 'prop-types';
import { Form, Message } from 'semantic-ui-react';
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

export const FormFieldErrorMessage = ({ message }) => {
  if (_.isEmpty(message)) {
    return '';
  }

  return (
    <Message error content={message} style={{ marginTop: '-0.75rem', marginBottom: '1rem' }} />
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
    <FormFieldErrorMessage message={errors[name]} />
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
