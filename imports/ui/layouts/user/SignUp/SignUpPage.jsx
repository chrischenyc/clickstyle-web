import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userSignedIn } from '../../../../modules/client/redux/user';
import { validateUserSignUp } from '../../../../modules/validate';
import SignUpForm from './SignUpForm';

// platform-independent stateful container component
// to handle SignUp logic
class SignUpPage extends Component {
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
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSocialSignIn = this.handleSocialSignIn.bind(this);
    this.handleAgreement = this.handleAgreement.bind(this);
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

    if (Object.keys(errors).length > 0) {
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

            this.props.userSignedIn(Meteor.user());
          }
        },
      );
    }
  }

  handleSocialSignIn(error) {
    if (!error) {
      this.props.userSignedIn(Meteor.user());
    }
  }

  handleAgreement(event, data) {
    this.setState({ disabled: !data.checked });
  }

  render() {
    return (
      <SignUpForm
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onSocialSignIn={this.handleSocialSignIn}
        onAgreement={this.handleAgreement}
        loading={this.state.loading}
        errors={this.state.errors}
        disabled={this.state.disabled}
      />
    );
  }
}

SignUpPage.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  userSignedIn: (user) => {
    dispatch(userSignedIn(user));
  },
});
export default connect(null, mapDispatchToProps)(SignUpPage);
