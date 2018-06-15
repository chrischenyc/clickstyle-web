import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Divider, Checkbox, Container, Message } from 'semantic-ui-react';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';
import SocialLoginButtons from '../../../components/SocialLoginButtons';

// web version of the sign up form, stateless component
const SignUpPage = ({
  onSubmit,
  onChange,
  onAgreement,
  disabled,
  loading,
  errors,
  onSocialSignedIn,
  from,
}) => (
  <Container className="margin-top-40 margin-bottom-60">
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

            {!_.isEmpty(errors.message) && <Message error>{errors.message}</Message>}
          </Form>

          <p className="margin-top-20">
            Already have an account?&nbsp;
            <Link
              to={{
                pathname: '/login',
                state: { from },
              }}
            >
              Log in
            </Link>
            &nbsp;here
          </p>

          <Checkbox
            className="margin-bottom-20"
            defaultChecked
            onChange={onAgreement}
            label={
              <label htmlFor="agreement">
                I confirm I am over 18 and I agree to {Meteor.settings.public.appName}&apos;s&nbsp;
                <Link to="/terms">Terms of Use</Link>&nbsp;and&nbsp;
                <Link to="/privacy">Privacy Policy</Link>.
              </label>
            }
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

SignUpPage.defaultProps = {
  from: null,
};

SignUpPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAgreement: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  onSocialSignedIn: PropTypes.func.isRequired,
  from: PropTypes.object,
};

export default SignUpPage;
