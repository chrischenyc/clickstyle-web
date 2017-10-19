import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Message, TextArea } from 'semantic-ui-react';
import _ from 'lodash';
import GeoSuggest from 'react-geosuggest';

import '../../../../components/GeoSuggest.css';
import FormInputField from '../../../../components/FormInputField';

// web version of the login form, stateless component
const EditProfilePage = ({
  profile,
  onSubmit,
  onChange,
  onAddressSuggest,
  loading,
  saving,
  pristine,
  errors,
}) => (
  <Form onSubmit={onSubmit} loading={loading || saving} error={!_.isEmpty(errors)}>
    <FormInputField
      label="First name"
      placeholder="First name"
      name="name.first"
      onChange={onChange}
      errors={errors}
      value={_.has(profile, 'name.first') ? profile.name.first : ''}
    />

    <FormInputField
      label="Last name"
      placeholder="Last name"
      name="name.last"
      onChange={onChange}
      errors={errors}
      value={_.has(profile, 'name.last') ? profile.name.last : ''}
      note={`This is not on your public profile. This is only shared with another ${Meteor.settings
        .public.company.applicationName} user once you two have a confirmed booking .`}
    />

    <FormInputField
      label="Mobile number"
      placeholder="Mobile number"
      name="mobile"
      onChange={onChange}
      errors={errors}
      value={_.has(profile, 'mobile') ? profile.mobile : ''}
      note={`This is not on your public profile. This is only shared with another ${Meteor.settings
        .public.company.applicationName} user once you two have a confirmed booking .`}
    />

    <Form.Field>
      <label>Where about you</label>

      <GeoSuggest
        placeholder="type to search ..."
        country="au"
        name="address.raw"
        initialValue={_.has(profile, 'address.raw') ? profile.address.raw : ''}
        onChange={(value) => {
          // convert to generic onChange param
          onChange({ target: { name: 'address.raw', value } });
        }}
        onSuggestSelect={(suggest) => {
          // force onChange as well
          onChange({ target: { name: 'address.raw', value: suggest.label } });
          onAddressSuggest(suggest);
        }}
      />

      <p style={{ marginTop: '0.25rem', marginBottom: '1rem', color: '#aaa' }}>
        {`This is not on your public profile. This is only shared with another ${Meteor.settings
          .public.company.applicationName} user once you two have a confirmed booking .`}
      </p>
    </Form.Field>

    <FormInputField
      label="About you"
      name="about"
      control={TextArea}
      autoHeight
      onChange={onChange}
      errors={errors}
      value={_.has(profile, 'about') ? profile.about : ''}
      note="Help other people get to know you. Tell them about the things you like..."
    />

    <Button color="teal" size="large" type="submit" disabled={pristine} loading={saving}>
      Save
    </Button>

    {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
  </Form>
);

EditProfilePage.defaultProps = {
  profile: {},
};

EditProfilePage.propTypes = {
  profile: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddressSuggest: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditProfilePage;
