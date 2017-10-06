import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

const NewJob = () => (
  <div className="full-page">
    <Segment
      style={{
        padding: '8em 0em',
      }}
      vertical
    >
      <Container>
        <Header>new job</Header>
      </Container>
    </Segment>
  </div>
);

export default NewJob;
