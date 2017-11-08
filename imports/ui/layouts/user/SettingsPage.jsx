import React from 'react';
import { Container, Header, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import ModalLink from '../../components/ModalLink';
import ForgotPassword from './ForgotPassword/ForgotPassword';

const SettingsPage = () => (
  <Container className="below-fixed-menu" style={{ padding: '4rem 0' }}>
    <Header as="h2">Settings</Header>

    <List>
      <List.Item>
        <Link to="/change-password">Change Password</Link>
      </List.Item>
      <List.Item>
        <ModalLink to="/forgot-password" component={<ForgotPassword modal />}>
          Reset password
        </ModalLink>
      </List.Item>
    </List>
  </Container>
);

export default SettingsPage;
