import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react';

// web version of the login form, stateless component

const SignUpForm = ({ onSubmit, onChange, loading, errors }) => (
  <div className="full-page below-fixed-menu">
    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form
          className="attached segment"
          onSubmit={onSubmit}
          loading={loading}
          error={errors.message !== ''}
        >
          <Segment>
            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              type="email"
              name="email"
              onChange={onChange}
              error={errors.email !== undefined && errors.email.length > 0}
            />
            <Message error content={errors.email} />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              onChange={onChange}
              error={errors.password !== undefined && errors.password.length > 0}
            />
            <Message error content={errors.password} />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password confirm"
              type="password"
              name="confirm"
              onChange={onChange}
              error={errors.confirm !== undefined && errors.confirm.length > 0}
            />
            <Message error content={errors.confirm} />

            <Button color="teal" fluid size="large" type="submit">
              Sign Up
            </Button>

            <Message error content={errors.message} />
          </Segment>
        </Form>
        <Message attached="bottom">
          {'Already have an account?'} <Link to="/login">Login here</Link>
        </Message>
      </Grid.Column>
    </Grid>
  </div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default SignUpForm;
