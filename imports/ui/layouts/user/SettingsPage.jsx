import React from 'react';
import { Container, Header, List, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import SideMenuContainer from '../../components/SideMenuContainer';

const SettingsPage = () => (
  <SideMenuContainer>
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
  </SideMenuContainer>
);

export default SettingsPage;
