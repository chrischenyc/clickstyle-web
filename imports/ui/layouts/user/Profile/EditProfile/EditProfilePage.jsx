import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message, TextArea } from 'semantic-ui-react';
import _ from 'lodash';

import FormInputField from '../../../../components/FormInputField';

// web version of the login form, stateless component
const EditProfilePage = ({
  onSubmit, onChange, loading, errors,
}) => (
  <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
    <FormInputField
      label="First name"
      placeholder="First name"
      name="firstName"
      onChange={onChange}
      errors={errors}
    />

    <FormInputField
      label="Last name"
      placeholder="Last name"
      name="lastName"
      onChange={onChange}
      errors={errors}
      note={`This is not on your public profile. This is only shared with another ${Meteor.settings
        .public.company.applicationName} user once you two have a confirmed booking .`}
    />

    <FormInputField
      label="Phone number"
      placeholder="Phone number"
      name="phone"
      onChange={onChange}
      errors={errors}
      note={`This is not on your public profile. This is only shared with another ${Meteor.settings
        .public.company.applicationName} user once you two have a confirmed booking .`}
    />

    <FormInputField
      label="Where about you"
      placeholder="type to search ..."
      name="addressSearch"
      onChange={onChange}
      errors={errors}
      note={`This is not on your public profile. This is only shared with another ${Meteor.settings
        .public.company.applicationName} user once you two have a confirmed booking .`}
    />

    <FormInputField
      label="About you"
      name="about"
      control={TextArea}
      onChange={onChange}
      errors={errors}
      note="Help other people get to know you. Tell them about the things you like..."
    />

    <Button color="teal" size="large" type="submit">
      Save
    </Button>

    {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
  </Form>
);

EditProfilePage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditProfilePage;
