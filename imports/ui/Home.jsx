import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

class Home extends Component {
  render() {
    return (
      <div>{this.props.currentUser && <Link to="/new-job">New Job</Link>}</div>
    );
  }
}

export default withTracker(props => {
  return {
    currentUser: Meteor.user()
  };
})(Home);
