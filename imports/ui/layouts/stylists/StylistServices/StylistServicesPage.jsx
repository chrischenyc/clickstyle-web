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
  profile,
  onSubmit,
  onChange,
  services,
  saving,
  pristine,
  errors,
}) => (
  <SideMenuContainer>
    <Container>
      <Button
        color={Meteor.settings.public.semantic.color}
        as={Link}
        to={`/profiles/${profile._id}`}
      >
        View stylist profile
      </Button>
      <Form onSubmit={onSubmit} loading={profile.fetching || saving} error={!_.isEmpty(errors)}>
        <Divider horizontal>Services &amp; Prices</Divider>

        <List>
          {services.map(service => (
            <List.Item key={service._id}>
              <Checkbox
                label={service.name}
                checked={service.checked}
                onChange={(event, data) => {
                  onServiceSelected(service, data.checked);
                }}
              />
            </List.Item>
          ))}
        </List>

        <Input
          labelPosition="right"
          type="text"
          name="basePrice"
          placeholder="base price"
          onChange={onChange}
          errors={errors}
          value={_.has(profile, 'basePrice') ? profile.basePrice : ''}
        >
          <Label basic>$</Label>
          <input />
          <Label>.00</Label>
        </Input>
        <p style={{ marginTop: '0', marginBottom: '1rem', color: '#aaa' }}>Base price means ...</p>

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
  profile: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  services: PropTypes.array.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
