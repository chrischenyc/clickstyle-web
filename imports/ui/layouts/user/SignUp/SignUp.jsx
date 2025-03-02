import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment-timezone';
import { Redirect } from 'react-router-dom';

import { userSignedIn } from '../../../../modules/client/redux/user';
import { validateUserSignUp } from '../../../../modules/validate';
import SignUpPage from './SignUpPage';

// platform-independent stateful container component
// to handle SignUp logic
class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      errors: {},
      loading: false,
      disabled: false,
      redirectToReferrer: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAgreement = this.handleAgreement.bind(this);
    this.handleLoggedIn = this.handleLoggedIn.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateUserSignUp(
      this.state.email,
      this.state.firstName,
      this.state.lastName,
      this.state.password,
    );

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      // http://docs.meteor.com/api/passwords.html#Accounts-createUser
      Accounts.createUser(
        {
          email: this.state.email,
          password: this.state.password,
          profile: {
            name: {
              first: this.state.firstName,
              last: this.state.lastName,
            },
          },
        },
        (error) => {
          if (error) {
            this.setState({
              loading: false,
              errors: {
                message: error.reason,
              },
            });
          } else {
            this.setState({
              loading: false,
              errors: {},
            });

            this.handleLoggedIn();
          }
        },
      );
    }
  }

  handleAgreement(event, data) {
    this.setState({ disabled: !data.checked });
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
    const { from } = this.props.location.state || { from: { pathname: '/' } };

    const { redirectToReferrer } = this.state;
    if (redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <SignUpPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onAgreement={this.handleAgreement}
        onSocialSignedIn={this.handleLoggedIn}
        loading={this.state.loading}
        errors={this.state.errors}
        disabled={this.state.disabled}
        from={from}
      />
    );
  }
}

SignUp.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
};

export default connect(
  null,
  { userSignedIn },
)(SignUp);
