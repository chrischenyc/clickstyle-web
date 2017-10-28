import React from 'react';
import { Container, Header, Button, Divider, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FormInputField from '../../components/FormInputField';

const StylistsJoinPage = ({
  onSubmit, onChange, disabled, loading, errors,
}) => (
  <Container text style={{ padding: '8rem 0' }}>
    <Header as="h1">Are you a stylist? Join the squad!</Header>

    <p>
      By joining stylesquad, you wil Expedita ducimus exercitationem ratione occaecati optio maxime
      non. Non perferendis praesentium error et. Illum molestias quibusdam cumque eum neque.
      Voluptas corporis fugiat tempora vitae animi dicta velit. Libero dignissimos dolore
      consequatur in non nesciunt laborum. Laudantium modi ut optio pariatur necessitatibus sed
      ullam itaque deserunt. Molestiae saepe accusantium ratione ut sunt doloribus non libero. Velit
      explicabo eligendi possimus. Quia ab quibusdam. Nobis ducimus dolorem culpa deleniti commodi
      velit voluptates. Est quia voluptates optio impedit. Eum ut est ut eligendi sed quis. Sapiente
      dolor eius eos rem magni.
    </p>

    <Divider horizontal>tell us about you</Divider>

    <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
      <FormInputField
        fluid
        placeholder="Field 1"
        name="field1"
        size="huge"
        onChange={onChange}
        errors={errors}
      />

      <FormInputField
        fluid
        placeholder="Field 2"
        name="field2"
        size="huge"
        onChange={onChange}
        errors={errors}
      />

      <Button color="teal" fluid size="huge" type="submit" disabled={disabled}>
        Join the squad!
      </Button>
    </Form>
  </Container>
);

StylistsJoinPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistsJoinPage;
