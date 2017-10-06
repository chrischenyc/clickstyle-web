import React from 'react';
import { Button, Container, Header, Segment, Card, Image, Icon } from 'semantic-ui-react';

import Jobs from '../api/Jobs.js';

const JobsList = ({ jobs }) => (
  <Segment
    textAlign="center"
    style={{
      padding: '2em 0em',
    }}
    vertical
  >
    <Container text>
      <Header as="h2" content="Jobs" />

      <Card.Group>
        <Card link="#">
          <Image src="/images/makeup.jpg" />
          <Card.Content textAlign="left">
            <Card.Header>Title</Card.Header>
            <Card.Meta>Location</Card.Meta>
            <Card.Description>
              Steve wants to add you to the group <strong>best friends</strong>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <a>
              <Icon name="user" />
              8 bidders
            </a>
          </Card.Content>
        </Card>
      </Card.Group>
    </Container>
  </Segment>
);

export default JobsList;
