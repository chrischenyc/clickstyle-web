import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import AuthRoute from '../helpers/AuthRoute';
import PublicRoute from '../helpers/PublicRoute';

import HomePage from '../layouts/home/HomePage';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NotFound from '../layouts/NotFound';

import Login from '../layouts/user/Login';
import Dashboard from '../layouts/user/Dashboard';
import Profile from '../layouts/user/Profile';
import Settings from '../layouts/user/Settings';

import BookingsPage from '../layouts/booking/BookingsPage';
import ViewBooking from '../layouts/booking/ViewBooking';
import NewBooking from '../layouts/booking/NewBooking';
import EditBooking from '../layouts/booking/EditBooking';

const App = props => (
  <Router>
    {props.loading ? (
      <div>
        <Header {...props} />
      </div>
    ) : (
      <div>
        <Header {...props} />
        <Switch>
          <Route exact path="/" component={HomePage} {...props} />

          <PublicRoute path="/login" component={Login} {...props} />

          <AuthRoute exact path="/dashboard" component={Dashboard} {...props} />
          <AuthRoute exact path="/profile" component={Profile} {...props} />
          <AuthRoute exact path="/settings" component={Settings} {...props} />

          <Route exact path="/bookings" component={BookingsPage} {...props} />
          <Route exact path="/bookings/new" component={NewBooking} {...props} />
          <Route exact path="/bookings/:id" component={ViewBooking} {...props} />
          <AuthRoute exact path="/bookings/:id/edit" component={EditBooking} {...props} />

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
    userId,
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
  };
})(App);
