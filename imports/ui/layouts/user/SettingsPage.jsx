import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => (
  <div className="container">
    <h2>Setting</h2>

    <ul className="list-unstyled">
      <li>
        <Link to="/users/change-password">Change Password</Link>
      </li>
      <li>
        <Link to="/users/reset-password">Reset Password</Link>
      </li>
    </ul>
  </div>
);

export default SettingsPage;
