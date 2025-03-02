import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Message } from 'semantic-ui-react';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';

const ChangePasswordPage = ({
  onSubmit, onChange, loading, errors, success,
}) => (
  <div className="container centered-content">
    {success && (
      <Message success size="huge">
        Success! Password has been changed, thanks!
      </Message>
    )}

    {!success && (
      <div className="col-md-offset-3 col-md-6">
        <h2>Change Your Password</h2>

        <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
          <FormInputField
            fluid
            size="huge"
            icon="lock"
            iconPosition="left"
            placeholder="Old password"
            type="password"
            name="oldPassword"
            onChange={onChange}
            errors={errors}
          />

          <FormInputField
            fluid
            size="huge"
            icon="lock"
            iconPosition="left"
            placeholder="New password"
            type="password"
            name="password"
            onChange={onChange}
            errors={errors}
          />

          <FormInputField
            fluid
            size="huge"
            icon="lock"
            iconPosition="left"
            placeholder="Confirm password"
            type="password"
            name="confirm"
            onChange={onChange}
            errors={errors}
          />

          {!_.isEmpty(errors.message) && <Message error>{errors.message}</Message>}

          <Button color="teal" size="huge" circular type="submit">
            Change password
          </Button>
        </Form>
      </div>
    )}
  </div>
);

ChangePasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
};

export default ChangePasswordPage;
