import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Divider, Checkbox, Container } from 'semantic-ui-react';
import _ from 'lodash';

import ModalLink from '../../../components/ModalLink';
import { FormInputField } from '../../../components/FormInputField';
import SocialLoginButtons from '../../../components/SocialLoginButtons';
import Login from '../Login/Login';

// web version of the sign up form, stateless component
const SignUpPage = ({
  onSubmit,
  onChange,
  onAgreement,
  disabled,
  loading,
  errors,
  modal,
  onSocialSignedIn,
  onDismissModal,
}) => (
  <Container className="margin-top-20">
    <Grid textAlign="center">
      <Grid.Row style={{ maxWidth: 450 }}>
        <Grid.Column>
          <SocialLoginButtons isSignUp disabled={disabled} onSocialSignedIn={onSocialSignedIn} />

          <Divider horizontal>or</Divider>

          <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
            <FormInputField
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email address"
              type="email"
              name="email"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="user"
              iconPosition="left"
              placeholder="First name"
              name="firstName"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Last name"
              name="lastName"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Create a Password"
              type="password"
              name="password"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <Button circular color="teal" fluid size="huge" type="submit" disabled={disabled}>
              Sign up
            </Button>

            {!_.isEmpty(errors.message) && (
              <div className="notification error"> {errors.message} </div>
            )}
          </Form>

          <p className="margin-top-20">
            Already have an account?&nbsp;
            {modal ? (
              <ModalLink to="/login" component={<Login modal />} title="Log in to continue">
                Log in
              </ModalLink>
            ) : (
              <Link to="/login">Log in</Link>
            )}
            &nbsp;here
          </p>

          <p className="margin-bottom-20">
            <Checkbox
              defaultChecked
              onChange={onAgreement}
              label={
                <label htmlFor="agreement">
                  I confirm I am over 18 and I agree to {Meteor.settings.public.appName}&apos;s&nbsp;
                  <Link
                    to="/terms"
                    onClick={() => {
                      if (modal && onDismissModal) {
                        onDismissModal();
                      }
                    }}
                  >
                    Terms of Use
                  </Link>&nbsp;and&nbsp;
                  <Link
                    to="/privacy"
                    onClick={() => {
                      if (modal && onDismissModal) {
                        onDismissModal();
                      }
                    }}
                  >
                    Privacy Policy
                  </Link>.
                </label>
              }
            />
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

SignUpPage.defaultProps = {
  onDismissModal: null,
};

SignUpPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAgreement: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  modal: PropTypes.bool.isRequired,
  onSocialSignedIn: PropTypes.func.isRequired,
  onDismissModal: PropTypes.func,
};

export default SignUpPage;
