import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { connect } from 'react-redux';
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

    this.handleFavourStylist = this.handleFavourStylist.bind(this);
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser() {
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

  handleFavourStylist() {
    const { _id } = this.props.match.params;

    Meteor.call(
      'stylists.favourite',
      {
        owner: _id,
        favourite: !this.state.user.stylist.favoured,
      },
      (error) => {
        if (!error) {
          this.loadUser();
        }
      },
    );
  }

  render() {
    if (_.isNil(this.state.user)) {
      return <Loading />;
    } else if (this.state.user.stylist) {
      return (
        <StylistProfilePage
          user={this.state.user}
          favourStylist={this.handleFavourStylist}
          authenticated={this.props.authenticated}
        />
      );
    }
    return <UserProfilePage profile={this.state.user.profile} />;
  }
}

UserProfile.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default withLoading(connect(mapStateToProps)(UserProfile));
