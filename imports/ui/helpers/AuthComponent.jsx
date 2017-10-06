import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Redirect } from 'react-router-dom';

const AuthComponent = ({ loggingIn, authenticated, children }) => {
  if (authenticated) {
    return children;
  } else if (loggingIn) {
    return <div />;
  }
  return <Redirect to="/" />;
};

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();

  return {
    loggingIn,
    authenticated: !loggingIn && user,
  };
})(AuthComponent);
