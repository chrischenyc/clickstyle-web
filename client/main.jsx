import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Home from "../imports/ui/Home";
import NotFound from "../imports/ui/NotFound";

Meteor.startup(() => {
  render(
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Router>,
    document.getElementById("app")
  );
});
