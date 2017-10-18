import React from 'react';
import { Container } from 'semantic-ui-react';
import ProfilePage from './ProfilePage';

const Profile = () => (
  <Container className="below-fixed-menu" style={{ padding: '4em 0' }}>
    <ProfilePage />
  </Container>
);

export default Profile;
