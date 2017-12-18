import React from 'react';
import { Container, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => (
  <Container>
    <List>
      <List.Item>
        <Link to="/users/change-password">Change Password</Link>
      </List.Item>
      <List.Item>
        <Link to="/users/reset-password">Reset password</Link>
      </List.Item>
    </List>
  </Container>
);

export default SettingsPage;
