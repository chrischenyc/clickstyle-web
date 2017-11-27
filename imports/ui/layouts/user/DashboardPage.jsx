import React from 'react';
import { Container } from 'semantic-ui-react';

import SideMenuContainer from '../../components/SideMenuContainer';
import EmailVerificationAlert from './EmailVerificationAlert/EmailVerificationAlert';

const DashboardPage = () => (
  <SideMenuContainer>
    <Container>
      <EmailVerificationAlert />

      <p>TODO: implement Dashboard</p>
    </Container>
  </SideMenuContainer>
);

export default DashboardPage;
