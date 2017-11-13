import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HOC
// As the name implies, routes created using the <SecureStylistRoute /> component are only
// intended to be accessed by logged-in stylist users.

const SecureStylistRoute = ({
  authenticated, userId, component, ...rest
}) => {
  if (authenticated) {
    if (userId) {
      if (Roles.userIsInRole(userId, [Meteor.settings.public.roles.stylist])) {
        return <Route component={component} {...rest} />;
      }

      return <Redirect to="/" />;
    }

    return '';
  }

  return <Redirect to="/" />;
};

SecureStylistRoute.defaultProps = {
  userId: null,
};

SecureStylistRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  userId: state.user.id,
});
export default connect(mapStateToProps)(SecureStylistRoute);
