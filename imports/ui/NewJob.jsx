import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class NewJob extends Component {
  render() {
    return this.props.currentUser ? <div>New Job</div> : <Redirect to="/" />;
  }
}

export default withTracker(() => ({
  currentUser: Meteor.user(),
}))(NewJob);
