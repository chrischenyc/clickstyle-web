import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { userSignedIn } from '../../../../modules/client/redux/user';
import { validateUserLogin } from '../../../../modules/validate';
import LoginForm from './LoginForm';

// platform-independent stateful container component
// to handle Login logic
class LoginPage extends Component {
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
    this.handleSocialSignIn = this.handleSocialSignIn.bind(this);
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

          this.props.userSignedIn(Meteor.user());
        }
      });
    }
  }

  handleSocialSignIn(error) {
    if (!error) {
      this.props.userSignedIn(Meteor.user());
    }
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onSocialSignIn={this.handleSocialSignIn}
        loading={this.state.loading}
        errors={this.state.errors}
      />
    );
  }
}

LoginPage.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  userSignedIn: (user) => {
    dispatch(userSignedIn(user));
  },
});
export default connect(null, mapDispatchToProps)(LoginPage);
