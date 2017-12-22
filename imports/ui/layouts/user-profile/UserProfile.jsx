import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../components/HOC';
import Loading from '../../components/Loading';
import UserProfilePage from './UserProfilePage';
import StylistProfilePage from './StylistProfilePage';

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

    this.props.showLoading();
    Meteor.call('users.profile', _id, (error, user) => {
      this.props.hideLoading();
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
    if (_.isNil(this.state.user)) {
      return <Loading />;
    } else if (this.state.user.stylist) {
      return <StylistProfilePage user={this.state.user} />;
    }
    return <UserProfilePage user={this.state.user} />;
  }
}

UserProfile.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(UserProfile);
