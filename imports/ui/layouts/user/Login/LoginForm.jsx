import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Divider } from 'semantic-ui-react';
import _ from 'lodash';

import FormInputField from '../../../components/FormInputField';
import SocialLoginButtons from '../SocialLoginButtons';

// web version of the login form, stateless component
const LoginForm = ({
  onSubmit, onChange, loading, errors,
}) => (
  <Grid textAlign="center" verticalAlign="middle" className="below-fixed-menu">
    <Grid.Row style={{ maxWidth: 450 }}>
      <Grid.Column>
        <Segment attached>
          <SocialLoginButtons />

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

            <Button color="teal" fluid size="huge" type="submit">
              Login
            </Button>

            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>

          <Link to="/forgot-password">
            <p style={{ margin: '0.5rem 0' }}>Forgot password?</p>
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
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default LoginForm;
