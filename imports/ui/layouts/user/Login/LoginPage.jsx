import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Divider } from 'semantic-ui-react';
import _ from 'lodash';

import ModalLink from '../../../components/ModalLink';
import FormInputField from '../../../components/FormInputField';
import SocialLoginButtons from '../../../components/SocialLoginButtons';
import SignUp from '../SignUp/SignUp';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

// web version of the login form, stateless component
const LoginPage = ({
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

            <Button color={Meteor.settings.public.semantic.color} fluid size="huge" type="submit">
              Login
            </Button>

            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>

          <ModalLink to="/forgot-password" component={<ForgotPassword />}>
            <p style={{ margin: '0.5rem 0' }}>Forgot password?</p>
          </ModalLink>
        </Segment>

        <Message attached="bottom" size="large">
          {"Don't have an account? "}
          <ModalLink to="/signup" component={<SignUp />} title="Join us">
            Sign up
          </ModalLink>
        </Message>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default LoginPage;
