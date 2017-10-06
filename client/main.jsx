import { Meteor } from 'meteor/meteor';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SecureRoute from '../imports/ui/SecureRoute';
import Home from '../imports/ui/Home';
import Header from '../imports/ui/Header';
import Footer from '../imports/ui/Footer';
import NotFound from '../imports/ui/NotFound';
import Login from '../imports/ui/Login';
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
          <Route path="/jobs/:id" component={JobPage} />
          <SecureRoute path="/new-job" component={NewJob} />
          <SecureRoute path="/edit-job" component={EditJob} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </Router>,
    document.getElementById('app'),
  );
});
