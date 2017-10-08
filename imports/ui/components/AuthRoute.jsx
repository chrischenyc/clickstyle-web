import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// HOC
// As the name implies, routes created using the <AuthRoute /> component are only
// intended to be accessed by logged-in users. To handle the authentication of a user,
// the component takes in two special props 'loggingIn' and 'authenticated' which are
// passed to the component via <App /> component.

const AuthRoute = ({ loggingIn, authenticated, component, ...rest }) => {
  if (authenticated) {
    return <Route component={component} {...rest} />;
  } else if (loggingIn) {
    return <div />;
  }
  return <Redirect to="/" />;
};

AuthRoute.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

export default AuthRoute;
