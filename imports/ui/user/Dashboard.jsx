import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

import AuthComponent from '../helpers/AuthComponent';

const Dashboard = () => (
  <AuthComponent>
    <div className="full-page">
      <Segment
        style={{
          padding: '8em 0em',
        }}
        vertical
      >
        <Container>
          <Header>dashboard</Header>
        </Container>
      </Segment>
    </div>
  </AuthComponent>
);

export default Dashboard;
