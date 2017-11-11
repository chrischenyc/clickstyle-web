import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Form,
  Message,
  TextArea,
  Divider,
  List,
  Checkbox,
  Label,
  Input,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import SideMenuContainer from '../../../components/SideMenuContainer';
import {
  FormInputField,
  FormFieldErrorMessage,
  FormFieldNote,
} from '../../../components/FormInputField';

const StylistServicesPage = ({
  selectedServices,
  availableServices,
  onSubmit,
  onChange,
  services,
  loading,
  saving,
  pristine,
  errors,
}) => (
  <SideMenuContainer>
    <Container>
      <Form onSubmit={onSubmit} loading={loading || saving} error={!_.isEmpty(errors)}>
        <Divider horizontal>Services &amp; Prices</Divider>

        <Button
          color={Meteor.settings.public.semantic.color}
          size="huge"
          type="submit"
          disabled={pristine}
          loading={saving}
        >
          Save
        </Button>

        {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
      </Form>
    </Container>
  </SideMenuContainer>
);

StylistServicesPage.propTypes = {
  selectedServices: PropTypes.array.isRequired,
  availableServices: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
