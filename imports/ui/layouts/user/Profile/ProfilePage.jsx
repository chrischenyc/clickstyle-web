import React from 'react';
import { Tab } from 'semantic-ui-react';

import EditProfile from './EditProfile/EditProfile';
import EditPhoto from './EditPhoto/EditPhoto';

const ProfilePage = () => (
  <Tab
    panes={[
      {
        menuItem: 'Edit Profile',
        render: () => (
          <Tab.Pane>
            <EditProfile />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Edit Photo',
        render: () => (
          <Tab.Pane>
            <EditPhoto />
          </Tab.Pane>
        ),
      },
      {
        menuItem: 'Products I Use',
        render: () => (
          <Tab.Pane>
            <p>TODO: implement products I use page</p>
          </Tab.Pane>
        ),
      },
      // TODO: stylist profile needs more tabs
    ]}
  />
);

export default ProfilePage;
