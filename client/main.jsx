import { Meteor } from 'meteor/meteor';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import AuthRoute from '../imports/ui/helpers/AuthRoute';
import Home from '../imports/ui/Home';
import Header from '../imports/ui/Header';
import Footer from '../imports/ui/Footer';
import NotFound from '../imports/ui/NotFound';
import Login from '../imports/ui/Login';
import Dashboard from '../imports/ui/user/Dashboard';
import Profile from '../imports/ui/user/Profile';
import Settings from '../imports/ui/user/Settings';
import JobPage from '../imports/ui/JobPage';
import NewJob from '../imports/ui/NewJob';
import EditJob from '../imports/ui/EditJob';

Meteor.startup(() => {
  render(
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <AuthRoute path="/dashboard" component={Dashboard} />
          <AuthRoute path="/profile" component={Profile} />
          <AuthRoute path="/settings" component={Settings} />
          <Route path="/jobs/:id" component={JobPage} />
          <Route path="/new-job" component={NewJob} />
          <AuthRoute path="/edit-job" component={EditJob} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </Router>,
    document.getElementById('app'),
  );
});
