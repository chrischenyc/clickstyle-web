import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Message, Divider } from 'semantic-ui-react';
import _ from 'lodash';

import SideMenuContainer from '../../../components/SideMenuContainer';

class StylistServicesPage extends Component {
  render() {
    const {
      onSubmit, loading, saving, pristine, errors,
    } = this.props;

    return (
      <SideMenuContainer>
        <Container>
          <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
            <Divider horizontal>regular available hours</Divider>

            <Button
              color={Meteor.settings.public.semantic.color}
              size="massive"
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
  }
}

StylistServicesPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
