import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form, Button, Message, Header } from 'semantic-ui-react';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';

const StylistPaymentPage = ({
  onChange,
  onSubmit,
  loading,
  saving,
  pristine,
  errors,
  accountName,
  bsb,
  accountNumber,
}) => (
  <Container text>
    <Header>Payment Info</Header>

    <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
      <label>Account Name</label>
      <FormInputField
        name="accountName"
        type="text"
        onChange={onChange}
        errors={errors}
        value={accountName}
      />

      <label>BSB</label>
      <FormInputField name="bsb" type="text" onChange={onChange} errors={errors} value={bsb} />

      <label>Account Number</label>
      <FormInputField
        name="accountNumber"
        type="text"
        onChange={onChange}
        errors={errors}
        value={accountNumber}
      />
      <Button
        circular
        size="huge"
        color="teal"
        type="submit"
        disabled={pristine || !_.isEmpty(errors)}
        loading={saving}
      >
        Save
      </Button>

      {!_.isEmpty(errors.submit) && <Message error>{errors.submit}</Message>}
    </Form>
  </Container>
);

StylistPaymentPage.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  accountName: PropTypes.string.isRequired,
  bsb: PropTypes.string.isRequired,
  accountNumber: PropTypes.string.isRequired,
};

export default StylistPaymentPage;
