import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

import AuthComponent from '../../helpers/AuthComponent';

const Profile = () => (
  <AuthComponent>
    <div className="full-page">
      <Segment
        style={{
          padding: '8em 0em',
        }}
        vertical
      >
        <Container>
          <Header>profile</Header>
        </Container>
      </Segment>
    </div>
  </AuthComponent>
);

export default Profile;
