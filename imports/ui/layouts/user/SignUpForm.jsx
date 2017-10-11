import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Divider } from 'semantic-ui-react';

import SocialLoginButtons from './SocialLoginButtons';

// web version of the sign up form, stateless component
const SignUpForm = ({ onSubmit, onChange, onFacebook, onGoogle, loading, errors }) => (
  <div className="full-page below-fixed-menu">
    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Segment attached>
          <SocialLoginButtons isSignUp onFacebook={onFacebook} onGoogle={onGoogle} />

          <Divider horizontal>or</Divider>

          <Form onSubmit={onSubmit} loading={loading} error={errors.message !== ''}>
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email address"
              type="email"
              name="email"
              size="huge"
              onChange={onChange}
              error={errors.email !== undefined && errors.email.length > 0}
            />
            <Message error content={errors.email} />

            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="First name"
              name="firstName"
              size="huge"
              onChange={onChange}
              error={errors.firstName !== undefined && errors.firstName.length > 0}
            />
            <Message error content={errors.firstName} />

            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Last name"
              name="lastName"
              size="huge"
              onChange={onChange}
              error={errors.lastName !== undefined && errors.lastName.length > 0}
            />
            <Message error content={errors.lastName} />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Create a Password"
              type="password"
              name="password"
              size="huge"
              onChange={onChange}
              error={errors.password !== undefined && errors.password.length > 0}
            />
            <Message error content={errors.password} />

            <Button color="teal" fluid size="huge" type="submit">
              Sign Up
            </Button>

            <Message error content={errors.message} />
          </Form>
        </Segment>

        <Message attached="bottom" size="large">
          {'Already have a Stylesquard account?'} <Link to="/login">Log in</Link>
        </Message>
      </Grid.Column>
    </Grid>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onFacebook: PropTypes.func.isRequired,
  onGoogle: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default SignUpForm;
