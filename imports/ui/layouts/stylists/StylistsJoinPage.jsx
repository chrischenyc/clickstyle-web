import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import {
  Container,
  Header,
  Button,
  Form,
  Checkbox,
  List
} from "semantic-ui-react";
import PropTypes from "prop-types";
import _ from "lodash";
import { UploadField as FileField } from "@navjobs/upload";
import { Link } from "react-router-dom";

import FormInputField from "../../components/FormInputField";

class StylistsJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agreementChecked: false
    };
  }

  render() {
    const {
      onSubmit,
      onChange,
      onServiceSelected,
      loading,
      errors,
      services
    } = this.props;

    return (
      <Container text style={{ padding: "8rem 0" }}>
        <Header as="h1">Tell us something about you</Header>

        <p>
          We need a bit extra information about you and the services you can
          provide... ducimus exercitationem ratione occaecati optio maxime non.
          Non perferendis praesentium error et. Illum molestias quibusdam cumque
          eum neque.
        </p>

        <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
          <Form.Field>
            <label>
              <Header>Services</Header>
            </label>
            <List size="large">
              {services.map(service => {
                return (
                  <List.Item key={service._id}>
                    <Checkbox
                      label={service.name}
                      size="large"
                      checked={service.checked}
                      onChange={(event, data) => {
                        onServiceSelected(service, data.checked);
                      }}
                    />
                  </List.Item>
                );
              })}
            </List>
          </Form.Field>

          <Form.Field>
            <label>
              <Header>Qualifications</Header>
            </label>
            <FileField
              onFiles={files => {}}
              uploadProps={{
                accept: ".jpg,.jpeg,.png,.bmp,.pdf,.doc"
              }}
            >
              <Button
                color={Meteor.settings.public.semantic.color}
                loading={false}
              >
                Upload file
              </Button>
              <span>
                &nbsp;maximum file size:{" "}
                {Meteor.settings.public.image.maxFileSize}MB
              </span>
            </FileField>
          </Form.Field>

          <FormInputField
            fluid
            placeholder="Please provide a link to view your work e.g Facebook, Instagram or your website."
            label={<Header>Reference</Header>}
            name="reference"
            size="large"
            onChange={onChange}
            errors={errors}
          />

          <Form.Field>
            <Checkbox
              defaultChecked
              label={
                <label htmlFor="agreement">
                  Check here to confirm that you agree to our&nbsp;
                  <Link to="/terms">Terms of Use</Link>&nbsp;and&nbsp;
                  <Link to="/privacy">Privacy</Link>.
                </label>
              }
              checked={this.state.agreementChecked}
              onChange={(event, data) => {
                this.setState({ agreementChecked: data.checked });
              }}
            />
          </Form.Field>

          <Button
            color={Meteor.settings.public.semantic.color}
            fluid
            size="large"
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

StylistsJoinPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onServiceSelected: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  services: PropTypes.array.isRequired
};

export default StylistsJoinPage;
