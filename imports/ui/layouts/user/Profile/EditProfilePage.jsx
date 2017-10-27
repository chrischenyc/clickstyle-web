import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Form,
  Message,
  TextArea,
  Label,
  Icon,
  Divider,
} from 'semantic-ui-react';
import _ from 'lodash';
import GeoSuggest from 'react-geosuggest';

import '../../../components/GeoSuggest.css';
import FormInputField from '../../../components/FormInputField';
import EditPhotoPage from './EditPhotoPage';

// web version of the login form, stateless component
const EditProfilePage = ({
  photo,
  onPhotoSelected,
  onPhotoUpload,
  onPhotoRemove,
  photoUploading,
  photoPristine,
  photoError,
  profile,
  brands,
  onSubmit,
  onChange,
  onAddressSuggest,
  saving,
  pristine,
  errors,
}) => (
  <Container className="below-fixed-menu">
    <Form
      onSubmit={onSubmit}
      loading={profile.fetching || saving}
      error={!_.isEmpty(errors) || !_.isEmpty(photoError)}
    >
      <Divider horizontal>Photo</Divider>

      <EditPhotoPage
        photo={photo}
        onPhotoSelected={onPhotoSelected}
        onPhotoUpload={onPhotoUpload}
        onPhotoRemove={onPhotoRemove}
        photoUploading={photoUploading}
        photoPristine={photoPristine}
        photoError={photoError}
      />

      <Divider horizontal>Basic info</Divider>

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
        note={`This is not on your public profile. This is only shared with another ${Meteor
          .settings.public.company.applicationName} user once you two have a confirmed booking .`}
      />

      <FormInputField
        label="Mobile number"
        placeholder="Mobile number"
        name="mobile"
        onChange={onChange}
        errors={errors}
        value={_.has(profile, 'mobile') ? profile.mobile : ''}
        note={`This is not on your public profile. This is only shared with another ${Meteor
          .settings.public.company.applicationName} user once you two have a confirmed booking .`}
      />

      <Form.Field>
        <label>Your address</label>

        <GeoSuggest
          placeholder="type to search address, suburb, or postcode"
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

      <Divider horizontal>Products</Divider>

      <Form.Field>
        <label>Products you used</label>
        <input
          placeholder="start searching by typing e.g.: l'oreal..."
          name="productsSearch"
          style={{ marginBottom: '0.5rem' }}
        />
        {/* TODO: write a tags component */}
        <Label>
          Maybelline<Icon name="delete" />
        </Label>
        <Label>
          NARS<Icon name="delete" />
        </Label>
        <Label>
          wet n wild<Icon name="delete" />
        </Label>
      </Form.Field>

      <Button color="teal" size="large" type="submit" disabled={pristine} loading={saving}>
        Save
      </Button>

      {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
    </Form>
  </Container>
);

EditProfilePage.propTypes = {
  photo: PropTypes.object,
  onPhotoSelected: PropTypes.func.isRequired,
  onPhotoUpload: PropTypes.func.isRequired,
  onPhotoRemove: PropTypes.func.isRequired,
  photoUploading: PropTypes.bool.isRequired,
  photoPristine: PropTypes.bool.isRequired,
  photoError: PropTypes.string.isRequired,
  profile: PropTypes.object.isRequired,
  brands: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddressSuggest: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default EditProfilePage;
