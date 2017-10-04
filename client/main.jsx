import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../imports/ui/Home";
import NewJob from "../imports/ui/NewJob";
import EditJob from "../imports/ui/EditJob";
import NotFound from "../imports/ui/NotFound";
import Header from "../imports/ui/Header";
import Footer from "../imports/ui/Footer";

Meteor.startup(() => {
  render(
    <Router>
      <div>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/new-job" component={NewJob} /> // TODO: authenticate
          <Route path="/edit-job" component={EditJob} /> // TODO: authenticate
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </Router>,
    document.getElementById("app")
  );
});
