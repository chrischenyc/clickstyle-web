import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

const ForgotPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/" />;
  } else if (success) {
    return (
      <div className="container centered-content" style={{ maxWidth: 450 }}>
        <div className="notification success">
          <p>
            <span>All set</span> check your email for a reset link!
          </p>
        </div>
      </div>
    );
  }

  const form = (
    <div className="container centered-content" style={{ maxWidth: 450 }}>
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
        {!_.isEmpty(errors.email) && <div className="notification error"> {errors.email} </div>}

        {!_.isEmpty(errors.message) && <div className="notification error"> {errors.message} </div>}

        <Button color="teal" size="huge" type="submit">
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
