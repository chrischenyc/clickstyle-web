import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Button } from 'semantic-ui-react';

const StylistsOnboardPage = () => (
  <Container style={{ padding: '8rem 0' }}>
    <Header as="h2">Stylists Onboard step 1</Header>
    <p>
      TODO: implement similar page as
      <a href="https://www.airbnb.com.au/become-a-host">https://www.airbnb.com.au/become-a-host</a>
    </p>
    <Button
      content="Continue"
      size="massive"
      color="teal"
      icon="right arrow"
      labelPosition="right"
      as={Link}
      to="/stylists/onboard/step2"
    />
  </Container>
);

export default StylistsOnboardPage;
