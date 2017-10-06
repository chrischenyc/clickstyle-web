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
            <Card.Header>inventore cupiditate voluptatem</Card.Header>
            <Card.Meta>Location: qui ea in</Card.Meta>
            <Card.Meta>Date: 15 Dec, 2017</Card.Meta>
            <Card.Description>
              Dolorem quis qui laudantium officia. Expedita et provident doloremque. Non at culpa
              ipsum quia earum non est. Est dolores ex molestiae modi a. Et voluptas fugit dolorem
              eligendi ea nostrum reiciendis recusandae ad.
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
