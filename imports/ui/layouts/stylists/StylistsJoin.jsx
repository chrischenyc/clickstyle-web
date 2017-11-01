import React, { Component } from "react";
import _ from "lodash";

import StylistsJoinPage from "./StylistsJoinPage";

class StylistJoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      loading: false,
      disabled: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    /*
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
          }
        },
      );
    }
    */
  }

  render() {
    return (
      <StylistsJoinPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.loading}
        errors={this.state.errors}
        disabled={this.state.disabled}
      />
    );
  }
}

export default StylistJoin;
