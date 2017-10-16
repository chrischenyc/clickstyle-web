import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Grid, Message, Header, Icon } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

const ForgotPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/" />;
  } else if (success) {
    return (
      <Container text className="below-fixed-menu" style={{ padding: '4em 0' }}>
        <Grid textAlign="left" verticalAlign="middle">
          <Message icon success>
            <Icon name="checkmark" />

            <Message.Content>All set, check your email for a reset link!</Message.Content>
          </Message>
        </Grid>
      </Container>
    );
  }

  return (
    <Container text className="below-fixed-menu" style={{ padding: '4em 0' }}>
      <Grid textAlign="left" verticalAlign="middle">
        <Grid.Row style={{ maxWidth: 450 }}>
          <Grid.Column>
            <Header as="h1">Reset Password</Header>
            <p>
              Enter the email address associated with your account, and we’ll email you a link to
              reset your password.
            </p>

            <Form
              onSubmit={onSubmit}
              loading={loading}
              error={errors.message !== undefined && errors.message !== ''}
            >
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
              <Message error content={errors.message} />

              <Button color="teal" size="huge" type="submit">
                Send reset link
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

ForgotPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ForgotPasswordPage;
