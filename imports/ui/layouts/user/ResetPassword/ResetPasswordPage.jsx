import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Grid, Message, Header, Icon } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';
import _ from 'lodash';

import { FormInputField } from '../../../components/FormInputField';
import { PrimaryColor } from '../../../../modules/client/constants';

const ResetPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/dashboard" />;
  } else if (success) {
    return (
      <Container text style={{ marginTop: '51px', padding: '4rem 0' }}>
        <Grid textAlign="left" verticalAlign="middle">
          <Message icon success>
            <Icon name="checkmark" />

            <Message.Content>All set, thanks!</Message.Content>
          </Message>
        </Grid>
      </Container>
    );
  }

  return (
    <Container text style={{ marginTop: '51px', padding: '4rem 0' }}>
      <Grid textAlign="left" verticalAlign="middle">
        <Grid.Row style={{ maxWidth: 450 }}>
          <Grid.Column>
            <Header as="h1">Reset Password</Header>

            <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
              <FormInputField
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="New password"
                type="password"
                name="password"
                size="huge"
                onChange={onChange}
                errors={errors}
              />

              <FormInputField
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Confirm password"
                type="password"
                name="confirm"
                size="huge"
                onChange={onChange}
                errors={errors}
              />

              {!_.isEmpty(errors.message) && <Message error content={errors.message} />}

              <Button color={PrimaryColor} size="huge" type="submit">
                Save and continue
              </Button>

              <p>
                By clicking &quot;Save and continue&quot;, I confirm I am over 18 and I agree
                to&nbsp;
                {Meteor.settings.public.applicationName}&apos;s&nbsp;
                <Link to="/terms">Terms of Use</Link>&nbsp;and&nbsp;
                <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

ResetPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ResetPasswordPage;
