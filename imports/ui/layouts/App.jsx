import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthRoute from '../helpers/AuthRoute';
import PublicRoute from '../helpers/PublicRoute';

import Home from '../layouts/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from '../layouts/NotFound';

import Login from '../layouts/user/Login';
import Dashboard from '../layouts/user/Dashboard';
import Profile from '../layouts/user/Profile';
import Settings from '../layouts/user/Settings';

import Jobs from '../layouts/job/Jobs';
import ViewJob from '../layouts/job/ViewJob';
import NewJob from '../layouts/job/NewJob';
import EditJob from '../layouts/job/EditJob';

const App = props => (
  <Router>
    {props.loading ? (
      <div />
    ) : (
      <div>
        <Header {...props} />
        <Switch>
          <Route path="/" exact component={Home} {...props} />

          <PublicRoute path="/login" component={Login} {...props} />

          <AuthRoute path="/dashboard" exact component={Dashboard} {...props} />
          <AuthRoute path="/profile" exact component={Profile} {...props} />
          <AuthRoute path="/settings" exact component={Settings} {...props} />

          <Route path="/jobs" exact component={Jobs} {...props} />
          <Route path="/jobs/:id" component={ViewJob} {...props} />
          <Route path="/jobs/new" exact component={NewJob} {...props} />
          <AuthRoute path="/edit-job/:id" exact component={EditJob} {...props} />

          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    )}
  </Router>
);

App.propTypes = {
  loading: PropTypes.bool.isRequired,
};

const getUserName = name =>
  ({
    string: name,
    object: `${name.first} ${name.last}`,
  }[typeof name]);

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name && getUserName(user.profile.name);
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: !loggingIn && !!userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
  };
})(App);
