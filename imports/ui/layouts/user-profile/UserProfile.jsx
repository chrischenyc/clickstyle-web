import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import UserProfilePage from './UserProfilePage';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    const { _id } = this.props.match.params;

    if (_.isNil(_id)) {
      this.props.history.push('/');
      return;
    }

    Meteor.call('users.profile', _id, (error, user) => {
      if (error) {
        console.log('error', error);
      }
      if (user) {
        if (_.isNil(user.profile)) {
          this.props.history.push('/');
          return;
        }
        this.setState({ user });
      }
    });
  }

  render() {
    return <UserProfilePage user={this.state.user} />;
  }
}

export default UserProfile;
