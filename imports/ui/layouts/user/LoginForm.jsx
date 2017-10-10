import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react';

// web version of the login form, stateless component

const LoginForm = ({ onSubmit, onChange, loading, error }) => (
  <div className="full-page below-fixed-menu">
    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Form
          className="attached segment"
          onSubmit={onSubmit}
          loading={loading}
          error={error !== ''}
        >
          <Segment>
            <Message error content={error} />

            <Form.Input
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email"
              type="email"
              name="email"
              onChange={onChange}
            />

            <Form.Input
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              onChange={onChange}
            />

            <Button color="teal" fluid size="large" type="submit">
              Login
            </Button>
          </Segment>
        </Form>
        <Message attached="bottom">
          {"Don't have an account?"} <Link to="/signup">Sign Up</Link>
        </Message>
      </Grid.Column>
    </Grid>
  </div>
);

export default LoginForm;
