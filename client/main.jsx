import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../imports/ui/Home";
import NewJob from "../imports/ui/NewJob";
import EditJob from "../imports/ui/EditJob";
import NotFound from "../imports/ui/NotFound";

Meteor.startup(() => {
  render(
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/new-job" component={NewJob} /> // TODO: authenticate
        <Route path="/edit-job" component={EditJob} /> // TODO: authenticate
        <Route component={NotFound} />
      </Switch>
    </Router>,
    document.getElementById("app")
  );
});
