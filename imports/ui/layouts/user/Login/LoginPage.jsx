import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Form, Grid, Divider, Button, Container } from 'semantic-ui-react';
import _ from 'lodash';

import ModalLink from '../../../components/ModalLink';
import { FormInputField } from '../../../components/FormInputField';
import SocialLoginButtons from '../../../components/SocialLoginButtons';
import SignUp from '../SignUp/SignUp';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

// web version of the login form, stateless component
const LoginPage = ({
  onSubmit, onChange, loading, errors, modal, onLoggedIn,
}) => (
  <Container className="margin-top-20">
    <Grid textAlign="center">
      <Grid.Row style={{ maxWidth: 450 }}>
        <Grid.Column>
          <SocialLoginButtons onLoggedIn={onLoggedIn} />

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

            {!_.isEmpty(errors.message) && (
              <div className="notification error"> {errors.message} </div>
            )}
          </Form>

          {modal ? (
            <ModalLink to="/forgot-password" component={<ForgotPassword modal />}>
              <p className="margin-top-20 margin-bottom-20">Forgot password?</p>
            </ModalLink>
          ) : (
            <Link to="/forgot-password">
              <p className="margin-top-20 margin-bottom-20">Forgot password?</p>
            </Link>
          )}

          <p className="margin-top-20 margin-bottom-20">
            Don&apos;t have an account?&nbsp;
            {modal ? (
              <ModalLink
                to="/signup"
                component={<SignUp modal onLoggedIn={onLoggedIn} />}
                title="Join us"
              >
                Sign up here
              </ModalLink>
            ) : (
              <Link to="/signup">Sign up</Link>
            )}
          </p>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

LoginPage.defaultProps = {
  onLoggedIn: null,
};

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  modal: PropTypes.bool.isRequired,
  onLoggedIn: PropTypes.func,
};

export default LoginPage;
