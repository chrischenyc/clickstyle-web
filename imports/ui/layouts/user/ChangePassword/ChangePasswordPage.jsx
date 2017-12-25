import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';

const ChangePasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/users/dashboard" />;
  } else if (success) {
    return (
      <div className="container centered-content">
        <div className="col-md-offset-3 col-md-6">
          <div className="notification success">
            <p>
              <span>Success!</span> Password has been changed, thanks!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container centered-content">
      <div className="col-md-offset-3 col-md-6">
        <h2>Change Your Password</h2>

        <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
          <FormInputField
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Old password"
            type="password"
            name="oldPassword"
            size="huge"
            onChange={onChange}
            errors={errors}
          />

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

          {!_.isEmpty(errors.message) && (
            <div className="notification error"> {errors.message} </div>
          )}

          <Button color="teal" size="huge" type="submit">
            Change password
          </Button>
        </Form>
      </div>
    </div>
  );
};

ChangePasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ChangePasswordPage;
