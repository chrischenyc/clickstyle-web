import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

const Settings = () => (
  <div className="full-page">
    <Segment
      style={{
        padding: '8em 0em',
      }}
      vertical
    >
      <Container>
        <Header>settings</Header>
      </Container>
    </Segment>
  </div>
);

export default Settings;
