import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Divider } from 'semantic-ui-react';
import _ from 'lodash';

import SocialLoginButtons from '../SocialLoginButtons';

// web version of the login form, stateless component
const LoginForm = ({
  onSubmit, onChange, onSocialSignIn, loading, errors,
}) => (
  <Grid textAlign="center" verticalAlign="middle" className="below-fixed-menu">
    <Grid.Row style={{ maxWidth: 450 }}>
      <Grid.Column>
        <Segment attached>
          <SocialLoginButtons callback={onSocialSignIn} />

          <Divider horizontal>or</Divider>

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

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              size="huge"
              onChange={onChange}
              error={!_.isEmpty(errors.password)}
            />
            {!_.isEmpty(errors.password) && <Message error content={errors.password} />}

            <Button color="teal" fluid size="huge" type="submit">
              Login
            </Button>

            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>

          <Link to="/forgot-password">
            <p style={{ margin: '0.5em 0' }}>Forgot password?</p>
          </Link>
        </Segment>

        <Message attached="bottom" size="large">
          {"Don't have an account?"} <Link to="/signup">Sign up</Link>
        </Message>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSocialSignIn: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default LoginForm;
