import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Redirect } from 'react-router-dom';

const AuthComponent = ({ currentUser, children }) => (currentUser ? children : <Redirect to="/" />);

export default withTracker(() => ({
  currentUser: Meteor.user(),
}))(AuthComponent);
