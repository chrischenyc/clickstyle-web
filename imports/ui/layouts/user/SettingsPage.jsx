import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

const SettingsPage = () => (
  <Container>
    <h2>Setting</h2>

    <ul className="list-unstyled">
      <li>
        <Link to="/users/change-password">Change Password</Link>
      </li>
      <li>
        <Link to="/users/reset-password">Reset Password</Link>
      </li>
    </ul>
  </Container>
);

export default SettingsPage;
