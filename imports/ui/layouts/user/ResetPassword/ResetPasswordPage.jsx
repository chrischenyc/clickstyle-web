import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';

const ResetPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/" />;
  } else if (success) {
    return (
      <div
        className="container centered-content margin-top-70 margin-bottom-70"
        style={{ maxWidth: 450 }}
      >
        <Message size="huge" success>
          All set, thank!
        </Message>
      </div>
    );
  }

  return (
    <div
      className="container centered-content margin-top-70 margin-bottom-70"
      style={{ maxWidth: 450 }}
    >
      <h2>Set new password</h2>

      <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
        <FormInputField
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="New password"
          type="password"
          name="password"
          size="huge"
          onChange={onChange}
          errors={errors}
        />

        <FormInputField
          fluid
          icon="lock"
          iconPosition="left"
          placeholder="Confirm password"
          type="password"
          name="confirm"
          size="huge"
          onChange={onChange}
          errors={errors}
        />

        {!_.isEmpty(errors.message) && <Message error>{errors.message}</Message>}

        <Button circular color="teal" size="huge" type="submit">
          Save and continue
        </Button>
      </Form>
    </div>
  );
};

ResetPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ResetPasswordPage;
