import React from 'react';
import { Button, Container, Header, Segment, Card, Image, Icon } from 'semantic-ui-react';

import Jobs from '../api/Jobs.js';

const JobsList = ({ jobs, loading }) => (
  <Segment
    textAlign="center"
    style={{
      padding: '2em 0em',
    }}
    vertical
  >
    <Container>
      <Card.Group stackable>
        {jobs.map(job => (
          <Card key={job._id} link centered href={`/jobs/${job._id}`}>
            <Image src="/images/makeup.jpg" />
            <Card.Content textAlign="left">
              <Card.Header>{job.title}</Card.Header>
              <Card.Meta href={`/location/${job.location}`}>{job.location}</Card.Meta>
              <Card.Meta>{job.createdAt.toLocaleDateString()}</Card.Meta>
              <Card.Description>{job.summary}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Icon name="user" />8 bidders
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  </Segment>
);

export default JobsList;
