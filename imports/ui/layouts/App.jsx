import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthRoute from '../helpers/AuthRoute';
import Home from '../layouts/Home';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from '../layouts/NotFound';
import Login from '../layouts/user/Login';
import Dashboard from '../layouts/user/Dashboard';
import Profile from '../layouts/user/Profile';
import Settings from '../layouts/user/Settings';
import JobPage from '../layouts/job/JobPage';
import NewJob from '../layouts/job/NewJob';
import EditJob from '../layouts/job/EditJob';

const App = props => (
  <Router>
    {props.loading ? (
      <div />
    ) : (
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <AuthRoute path="/profile" component={Profile} />
          <AuthRoute path="/settings" component={Settings} />
          <Route path="/jobs/:id" component={JobPage} />
          <Route path="/new-job" component={NewJob} />
          <AuthRoute path="/edit-job" component={EditJob} />
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
