import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

const ForgotPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/" />;
  } else if (success) {
    return (
      <Message success size="huge">
        All set, check your email for a change password link!
      </Message>
    );
  }

  const form = (
    <div
      className="container centered-content padding-top-30 padding-bottom-30"
      style={{ maxWidth: 450 }}
    >
      <h2>Reset Password</h2>
      <p>
        Enter the email address associated with your account, and we&apos;ll email you a link to
        reset your password.
      </p>

      <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
        <Form.Input
          fluid
          icon="mail"
          iconPosition="left"
          placeholder="Email address"
          type="email"
          name="email"
          size="huge"
          onChange={onChange}
          error={!_.isEmpty(errors.email)}
        />
        {!_.isEmpty(errors.email) && <Message error>{errors.email}</Message>}

        {!_.isEmpty(errors.message) && <Message error>{errors.message}</Message>}

        <Button color="teal" circular size="huge" type="submit">
          Send reset link
        </Button>
      </Form>
    </div>
  );

  return form;
};

ForgotPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ForgotPasswordPage;
