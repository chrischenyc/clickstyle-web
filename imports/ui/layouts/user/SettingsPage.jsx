import React from 'react';
import { Container, Header, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import SideMenuContainer from '../../components/SideMenuContainer';

const SettingsPage = () => (
  <SideMenuContainer>
    <Container>
      <Header as="h2">Settings</Header>

      <List>
        <List.Item>
          <Link to="/change-password">Change Password</Link>
        </List.Item>
        <List.Item>
          <Link to="/reset-password">Reset password</Link>
        </List.Item>
      </List>
    </Container>
  </SideMenuContainer>
);

export default SettingsPage;
