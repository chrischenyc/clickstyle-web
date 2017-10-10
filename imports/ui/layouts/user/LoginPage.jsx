import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import LoginForm from './LoginForm';

// platform-independent stateful container component
// to handle Login logic
class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: '',
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.setState({ loading: true, errors: {} });
    event.preventDefault();

    Meteor.loginWithPassword(this.state.email, this.state.password, (error) => {
      if (error) {
        this.setState({
          loading: false,
          error: error.reason,
        });
      } else {
        this.setState({
          loading: false,
          error: '',
        });
        // will be redirect to /dashboard
      }
    });
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
        error={this.state.error}
      />
    );
  }
}

export default LoginPage;
