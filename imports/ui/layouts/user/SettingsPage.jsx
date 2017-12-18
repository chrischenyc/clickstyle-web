import React from 'react';
import { Container, List, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const SettingsPage = () => (
  <Container>
    <Divider horizontal>Password</Divider>
    <List>
      <List.Item>
        <Link to="/users/settings/change-password">Change Password</Link>
      </List.Item>
      <List.Item>
        <Link to="/users/settings/reset-password">Reset password</Link>
      </List.Item>
    </List>
  </Container>
);

export default SettingsPage;
