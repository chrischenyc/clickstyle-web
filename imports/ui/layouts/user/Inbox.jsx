import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import EmailVerificationAlert from './EmailVerificationAlert/EmailVerificationAlert';

const Inbox = () => (
  <Container className="below-fixed-menu" style={{ padding: '4em 0' }}>
    <EmailVerificationAlert />
    <Header>inbox</Header>
  </Container>
);

export default Inbox;
