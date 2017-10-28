import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';

const StylistsJoinPage = () => (
  <Container style={{ padding: '8rem 0' }}>
    <Header as="h1">Join the squad!</Header>

    <Button content="Continue" size="huge" color="teal" icon="right arrow" labelPosition="right" />
  </Container>
);

export default StylistsJoinPage;
