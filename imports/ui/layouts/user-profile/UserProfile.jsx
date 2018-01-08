import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../components/HOC';
import Loading from '../../components/Loading';
import UserProfilePage from './UserProfilePage';
import StylistProfilePage from './StylistProfilePage';
import { selectStylist, selectService } from '../../../modules/client/redux/cart';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };

    this.handleFavourStylist = this.handleFavourStylist.bind(this);
    this.handleServiceSelected = this.handleServiceSelected.bind(this);
    this.handleBook = this.handleBook.bind(this);
  }

  componentDidMount() {
    this.loadUser(this.props.match.params._id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params._id !== this.props.match.params._id) {
      this.loadUser(nextProps.match.params._id);
    }
  }

  loadUser(_id) {
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

        if (!_.isNil(user.stylist)) {
          this.props.selectStylist(user.stylist);
        }
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
          this.loadUser(this.props.match.params._id);
        }
      },
    );
  }

  handleServiceSelected(service, addon = null) {
    if (!_.isNil(this.state.user.stylist)) {
      this.props.selectService(this.state.user.stylist, service, addon);
    }
  }

  handleBook() {
    this.props.history.push('/booking');
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
          userId={this.props.userId}
          onServiceSelected={this.handleServiceSelected}
          onBook={this.handleBook}
        />
      );
    }
    return <UserProfilePage profile={this.state.user.profile} />;
  }
}

UserProfile.defaultProps = {
  userId: null,
};

UserProfile.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  selectStylist: PropTypes.func.isRequired,
  selectService: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  userId: state.user.id,
});

export default withLoading(connect(mapStateToProps, { selectStylist, selectService })(UserProfile));
