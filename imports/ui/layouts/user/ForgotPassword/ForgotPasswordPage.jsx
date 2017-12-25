import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message, Icon } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import { PrimaryColor } from '../../../../modules/client/constants';

const ForgotPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/" />;
  } else if (success) {
    return (
      <div className="container centered-content" style={{ maxWidth: 450 }}>
        <Message icon success>
          <Icon name="checkmark" />

          <Message.Content>All set, check your email for a reset link!</Message.Content>
        </Message>
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
        {!_.isEmpty(errors.email) && <Message error content={errors.email} />}

        {!_.isEmpty(errors.message) && <Message error content={errors.message} />}

        <Button color={PrimaryColor} size="huge" type="submit">
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
