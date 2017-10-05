import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Meteor } from "meteor/meteor";

// high order component either display child component or re-direct to home
const SecureRoute = ({ ...rest }) => {
  return true ? <Route {...rest} /> : <Redirect to="/" />;
};

export default SecureRoute;
