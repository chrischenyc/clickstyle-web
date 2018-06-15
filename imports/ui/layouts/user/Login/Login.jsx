import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { Redirect } from 'react-router-dom';

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
      redirectToReferrer: false,
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

    this.setState({ redirectToReferrer: true });
  }

  render() {
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer === true) {
      const { from } = this.props.location.state || { from: { pathname: '/' } };
      return <Redirect to={from} />;
    }

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

Login.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
};

export default connect(
  null,
  { userSignedIn },
)(Login);
