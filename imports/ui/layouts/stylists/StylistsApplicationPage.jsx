import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { Container, Form, Checkbox, List, Message, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { UploadField as FileField } from '@navjobs/upload';
import { Link } from 'react-router-dom';

import SemanticGeoSuggest from '../../components/SemanticGeoSuggest/SemanticGeoSuggest';
import { FormInputField } from '../../components/FormInputField';
import { dateString } from '../../../modules/format-date';

class StylistsApplicationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agreementChecked: false,
    };
  }

  render() {
    const {
      onSubmit,
      onChange,
      onServiceSelected,
      loading,
      errors,
      mobile,
      address,
      services,
      qualificationFile,
      referenceUrl,
      application,
    } = this.props;

    if (application) {
      if (application.approved) {
        return (
          <Container className="margin-top-35 margin-bottom-35">
            <h2>Welcome to the club!</h2>

            <p>
              Your application was approved on {dateString(application.approvedAt)}. Thanks for
              being part of us.
            </p>

            <p>
              Meanwhile, if you have any question, feel free to&nbsp;
              <Link to="/contact">contact us</Link>.
            </p>
          </Container>
        );
      }

      return (
        <Container className="margin-top-60 margin-bottom-60">
          <h2>Relax and sit tight</h2>

          <p>
            Your previous application submitted on {dateString(application.createdAt)} is under
            review process, we will contact you shortly.
          </p>

          <p>
            Meanwhile, if you have any question, feel free to&nbsp;
            <Link to="/contact">contact us</Link>.
          </p>
        </Container>
      );
    }

    return (
      <Container className="margin-top-35 margin-bottom-35">
        <h2>Tell us something about you</h2>

        <p>
          We need a bit extra information about you and the services you can provide... ducimus
          exercitationem ratione occaecati optio maxime non. Non perferendis praesentium error et.
          Illum molestias quibusdam cumque eum neque.
        </p>

        <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
          <FormInputField
            label={<h3>Mobile number</h3>}
            placeholder="Mobile number"
            name="mobile"
            onChange={onChange}
            errors={errors}
            note="This is not on your public profile. We may ring you to confirm ..."
            value={mobile}
          />

          <Form.Field>
            <label>
              <h3>Your address</h3>
            </label>

            <SemanticGeoSuggest
              placeholder="type to search address"
              country="au"
              name="address"
              onChange={(value) => {
                // convert to generic onChange param
                onChange({ target: { name: 'address', value } });
              }}
              onSuggestSelect={(suggest) => {
                // force onChange as well
                onChange({
                  target: { name: 'address', value: suggest.label },
                });
              }}
              initialValue={address}
            />

            {!_.isEmpty(errors.address) && (
              <Message
                error
                content={errors.address}
                style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
              />
            )}

            <p
              style={{
                marginTop: '0.25rem',
                marginBottom: '1rem',
                color: '#aaa',
              }}
            >
              {'This is not on your public profile. We need this info to confirm...'}
            </p>
          </Form.Field>

          <Form.Field>
            <label>
              <h3>Services</h3>
            </label>
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

            {!_.isEmpty(errors.services) && (
              <Message
                error
                content={errors.services}
                style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
              />
            )}
          </Form.Field>

          <Form.Field>
            <label>
              <h3>Qualifications</h3>
            </label>

            {qualificationFile ? (
              <Message
                info
                icon="file"
                content={qualificationFile.name}
                onDismiss={() => {
                  onChange({ target: { name: 'qualificationFile', value: null } });
                }}
              />
            ) : (
              <FileField
                name="qualificationFile"
                onFiles={(files) => {
                  onChange({ target: { name: 'qualificationFile', value: files[0] } });
                }}
                uploadProps={{
                  accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx,.dot',
                }}
              >
                <Button circular basic color="teal" loading={false}>
                  Upload file (maximum file size: {Meteor.settings.public.maxDocSize}MB)
                </Button>
              </FileField>
            )}

            {!_.isEmpty(errors.qualificationFile) && (
              <Message
                error
                content={errors.qualificationFile}
                style={{ marginTop: '-0.75rem', marginBottom: '1rem' }}
              />
            )}
          </Form.Field>

          <FormInputField
            fluid
            placeholder="Please provide a link to view your work e.g Facebook, Instagram or your website."
            label={<h3>Reference</h3>}
            name="referenceUrl"
            onChange={onChange}
            errors={errors}
            value={referenceUrl}
          />

          <Form.Field>
            <Checkbox
              defaultChecked
              label={
                <label htmlFor="agreement">
                  I confirm I am over 18 and I agree to&nbsp;
                  {Meteor.settings.public.appName}&apos;s&nbsp;
                  <Link to="/terms">Terms of Use</Link>&nbsp;and&nbsp;
                  <Link to="/privacy">Privacy Policy</Link>.
                </label>
              }
              defaultChecked={this.state.agreementChecked}
              onChange={(event, data) => {
                this.setState({ agreementChecked: data.checked });
              }}
            />
          </Form.Field>

          <Button
            circular
            color="teal"
            size="huge"
            type="submit"
            disabled={!this.state.agreementChecked}
          >
            Join
          </Button>
        </Form>
      </Container>
    );
  }
}

StylistsApplicationPage.defaultProps = {
  application: null,
};

StylistsApplicationPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onServiceSelected: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  mobile: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  qualificationFile: PropTypes.object,
  referenceUrl: PropTypes.string.isRequired,
  application: PropTypes.object,
};

export default StylistsApplicationPage;
