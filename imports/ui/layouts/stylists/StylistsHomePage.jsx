import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Button } from 'semantic-ui-react';

const StylistsHomePage = () => (
  <Container style={{ padding: '8rem 0' }}>
    <Header as="h2">Stylists Landing Page</Header>
    <p>
      TODO: implement similar page as{' '}
      <a href="https://www.airbnb.com.au/host/homes?from_nav=1">
        https://www.airbnb.com.au/host/homes?from_nav=1
      </a>
    </p>

    <Button size="massive" color="teal" as={Link} to="/stylists/onboard">
      Get Started
    </Button>
  </Container>
);

export default StylistsHomePage;
