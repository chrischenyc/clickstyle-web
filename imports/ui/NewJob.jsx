import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Redirect } from "react-router-dom";

class NewJob extends Component {
  render() {
    return this.props.currentUser ? <div>New Job</div> : <Redirect to="/" />;
  }
}

export default withTracker(props => {
  return {
    currentUser: Meteor.user()
  };
})(NewJob);
