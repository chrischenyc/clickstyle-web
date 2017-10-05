import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Redirect } from "react-router-dom";

class EditJob extends Component {
  render() {
    return this.props.currentUser ? <div>Edit Job</div> : <Redirect to="/" />;
  }
}

export default withTracker(props => {
  return {
    currentUser: Meteor.user()
  };
})(EditJob);
