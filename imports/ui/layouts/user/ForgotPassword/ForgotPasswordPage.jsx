import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Grid, Message, Header, Icon } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import SideMenuContainer from '../../../components/SideMenuContainer';
import { PrimaryColor } from '../../../../modules/client/constants';

const ForgotPasswordPage = ({
  onSubmit,
  onChange,
  loading,
  errors,
  success,
  redirect,
  modal,
  embedded,
}) => {
  if (redirect) {
    return <Redirect to="/" />;
  } else if (success) {
    return (
      <Container text style={{ marginTop: modal || embedded ? '0' : '51px', padding: '2rem 0' }}>
        <Grid textAlign="left" verticalAlign="middle">
          <Message icon success>
            <Icon name="checkmark" />

            <Message.Content>All set, check your email for a reset link!</Message.Content>
          </Message>
        </Grid>
      </Container>
    );
  }

  const form = (
    <Container text style={{ marginTop: modal || embedded ? '0' : '51px', padding: '2rem 0' }}>
      <Grid textAlign="left" verticalAlign="middle">
        <Grid.Row style={{ maxWidth: 450 }}>
          <Grid.Column>
            <Header as="h1">Reset Password</Header>
            <p>
              Enter the email address associated with your account, and we’ll email you a link to
              reset your password.
            </p>

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

              {!_.isEmpty(errors.message) && <Message error content={errors.message} />}

              <Button color={PrimaryColor} size="huge" type="submit">
                Send reset link
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );

  if (embedded) {
    return <SideMenuContainer>{form}</SideMenuContainer>;
  }
  return form;
};

ForgotPasswordPage.defaultProps = {
  modal: false,
  embedded: false,
};

ForgotPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
  modal: PropTypes.bool,
  embedded: PropTypes.bool,
};

export default ForgotPasswordPage;
