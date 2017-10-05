import { withTracker } from 'meteor/react-meteor-data';

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class EditJob extends Component {
  render() {
    return this.props.currentUser ? <div>Edit Job</div> : <Redirect to="/" />;
  }
}

export default withTracker(props => ({
  currentUser: Meteor.user(),
}))(EditJob);
