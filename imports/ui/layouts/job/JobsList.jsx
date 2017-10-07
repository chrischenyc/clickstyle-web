import React from 'react';
import { Container, Segment, Card, Image, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// TODO: remove placeholder images
const jobImages = [
  'https://images.unsplash.com/photo-1503236823255-94609f598e71?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1496019392116-5342906878cc?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1469232136325-aa07d3461bc6?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1500350124139-04a90e4ce9f6?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
];

const JobsList = ({ jobs }) => (
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
            <Image src={_.sample(jobImages)} />
            <Card.Content textAlign="left">
              <Card.Header>{job.title}</Card.Header>
              <Card.Meta>{job.location}</Card.Meta>
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

JobsList.propTypes = {
  jobs: PropTypes.array.isRequired,
};

export default JobsList;
