import React from 'react';
import { Container, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Settings = () => (
  <Container text className="below-fixed-menu" style={{ padding: '4em 0' }}>
    <Header>settings</Header>
    <Link to="/change-password">Change Password</Link>
  </Container>
);

export default Settings;
