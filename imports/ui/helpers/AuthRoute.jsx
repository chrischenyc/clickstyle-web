import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// high order component either display child component or re-direct to home
const AuthRoute = ({ ...rest }) => (Meteor.user() ? <Route {...rest} /> : <Redirect to="/" />);

export default AuthRoute;
