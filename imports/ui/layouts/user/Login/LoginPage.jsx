import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Grid, Divider, Button, Container, Message } from 'semantic-ui-react';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';
import SocialLoginButtons from '../../../components/SocialLoginButtons';

// web version of the login form, stateless component
const LoginPage = ({
  onSubmit, onChange, loading, errors, onSocialSignedIn, from,
}) => (
  <Container className="margin-top-80 margin-bottom-80">
    <Grid textAlign="center">
      <Grid.Row style={{ maxWidth: 450 }}>
        <Grid.Column>
          <SocialLoginButtons onSocialSignedIn={onSocialSignedIn} />

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
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <Button circular color="teal" fluid size="huge" type="submit">
              Login
            </Button>

            {!_.isEmpty(errors.message) && <Message error>{errors.message}</Message>}
          </Form>

          <Link to="/forgot-password">
            <p className="margin-top-20 margin-bottom-20">Forgot password?</p>
          </Link>

          <p className="margin-top-20 margin-bottom-20">
            Don&apos;t have an account?&nbsp;
            <Link
              to={{
                pathname: '/signup',
                state: { from },
              }}
            >
              Sign up
            </Link>
            &nbsp;here
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

LoginPage.defaultProps = {
  from: null,
};

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  onSocialSignedIn: PropTypes.func.isRequired,
  from: PropTypes.object,
};

export default LoginPage;
