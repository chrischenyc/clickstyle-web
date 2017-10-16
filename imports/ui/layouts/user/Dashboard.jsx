import React from 'react';
import { Container, Header } from 'semantic-ui-react';

import EmailVerificationAlert from './EmailVerificationAlert/EmailVerificationAlert';

const Dashboard = () => (
  <Container text className="below-fixed-menu" style={{ padding: '4em 0' }}>
    <EmailVerificationAlert />
    <Header>dashboard</Header>
  </Container>
);

export default Dashboard;
