import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Grid, Message, Header, Icon } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import SideMenuContainer from '../../../components/SideMenuContainer';
import FormInputField from '../../../components/FormInputField';

const ChangePasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/dashboard" />;
  } else if (success) {
    return (
      <SideMenuContainer>
        <Container text>
          <Grid textAlign="left" verticalAlign="middle">
            <Message icon success>
              <Icon name="checkmark" />

              <Message.Content>Password has been changed, thanks!</Message.Content>
            </Message>
          </Grid>
        </Container>
      </SideMenuContainer>
    );
  }

  return (
    <SideMenuContainer>
      <Container text>
        <Grid textAlign="left" verticalAlign="middle">
          <Grid.Row style={{ maxWidth: 450 }}>
            <Grid.Column>
              <Header as="h1">Change Your Password</Header>

              <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
                <FormInputField
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Old password"
                  type="password"
                  name="oldPassword"
                  size="huge"
                  onChange={onChange}
                  errors={errors}
                />

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

                <Button color={Meteor.settings.public.semantic.color} size="huge" type="submit">
                  Change password
                </Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </SideMenuContainer>
  );
};

ChangePasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ChangePasswordPage;
