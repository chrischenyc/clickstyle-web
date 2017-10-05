import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";

import AccountsUIWrapper from "../ui/AccountsUIWrapper";

class Header extends Component {
  render() {
    return (
      <div>
        <p>
          <Link to="/">Home</Link>
        </p>

        {this.props.currentUser ? (
          <button
            onClick={() => {
              Meteor.logout();
            }}
          >
            Logout
          </button>
        ) : (
          <AccountsUIWrapper />
        )}
      </div>
    );
  }
}

export default withTracker(props => {
  return {
    currentUser: Meteor.user()
  };
})(Header);
