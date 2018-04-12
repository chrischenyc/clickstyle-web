import React from 'react';
import PropTypes from 'prop-types';
import { Container, Header } from 'semantic-ui-react';
import _ from 'lodash';

const DashboardPage = props => (
  <Container>
    {!_.isEmpty(props.firstName) && <Header as="h2">Hi, {props.firstName}!</Header>}
  </Container>
);

DashboardPage.propTypes = {
  firstName: PropTypes.string.isRequired,
  isStylist: PropTypes.bool.isRequired,
};

export default DashboardPage;
