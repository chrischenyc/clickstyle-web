import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import { validateUserLogin } from '../../../validators/user';
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

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateUserLogin(this.state.email, this.state.password);
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });
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
          // will be redirect to /dashboard
        }
      });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });

    // TODO: client validation
  }

  render() {
    return (
      <LoginForm
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.loading}
        errors={this.state.errors}
      />
    );
  }
}

export default LoginPage;
