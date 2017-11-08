import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import SideMenuContainer from '../../components/SideMenuContainer';
import EmailVerificationAlert from './EmailVerificationAlert/EmailVerificationAlert';

const DashboardPage = () => (
  <SideMenuContainer>
    <Container>
      <EmailVerificationAlert />
      <Header as="h2">Dashboard</Header>
      <p>TODO: implement Dashboard</p>
    </Container>
  </SideMenuContainer>
);

export default DashboardPage;
