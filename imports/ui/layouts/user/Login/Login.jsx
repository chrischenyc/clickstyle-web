import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import { setNextRoute } from '../../../../modules/client/redux/ui';
import { userSignedIn } from '../../../../modules/client/redux/user';
import { validateUserLogin } from '../../../../modules/validate';
import LoginPage from './LoginPage';

// platform-independent stateful container component
// to handle Login logic
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateUserLogin(this.state.email, this.state.password);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      // http://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword
      Meteor.loginWithPassword(this.state.email, this.state.password, (error) => {
        if (error) {
          this.setState({
            loading: false,
            errors: {
              message: error.error === 403 ? 'email and password do not match' : error.reason,
            },
          });
        } else {
          this.setState({
            loading: false,
            errors: {},
          });

          this.handleLoggedIn();
        }
      });
    }
  }

  handleLoggedIn() {
    // update user timezone in profile
    const timezone = moment.tz.guess() || 'Australia/Melbourne';
    Meteor.call('profiles.update.timezone', timezone);

    // force update redux store, as Meteor auto-run in App.jsx tends to lag
    this.props.userSignedIn(Meteor.user());

    // redirect if a nextRoute is stored in redux
    if (!_.isNil(this.props.nextRoute) && !_.isEmpty(this.props.nextRoute)) {
      this.props.history.push(this.props.nextRoute);
      this.props.setNextRoute(null);
    }
  }

  render() {
    return (
      <LoginPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onSocialSignedIn={this.handleLoggedIn}
        loading={this.state.loading}
        errors={this.state.errors}
      />
    );
  }
}

Login.defaultProps = {
  nextRoute: null,
};

Login.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
  setNextRoute: PropTypes.func.isRequired,
  nextRoute: PropTypes.string,
};

const mapStateToProps = state => ({
  nextRoute: state.ui.nextRoute,
});

export default connect(
  mapStateToProps,
  { setNextRoute, userSignedIn },
)(Login);
