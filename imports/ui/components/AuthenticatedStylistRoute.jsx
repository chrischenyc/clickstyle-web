import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HOC to prevent customer user from accessing stylist-only routes

const AuthenticatedStylistRoute = ({
  authenticated, isStylist, location, component, ...rest
}) => {
  if (!authenticated) {
    return (
      <Redirect
        to={{
          pathname: '/login',
          state: { from: location },
        }}
      />
    );
  } else if (!isStylist) {
    return (
      <Redirect
        to={{
          pathname: '/join',
        }}
      />
    );
  }

  return <Route component={component} {...rest} />;
};

AuthenticatedStylistRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  isStylist: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps)(AuthenticatedStylistRoute);
