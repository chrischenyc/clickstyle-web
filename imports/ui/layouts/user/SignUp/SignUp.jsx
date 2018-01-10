import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { closeModal } from '../../../../modules/client/redux/modal';
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
    // call back if in modal mode
    if (this.props.onLoggedIn) {
      this.props.onLoggedIn();
    }

    // TODO: redirect to url stored in redux
  }

  render() {
    return (
      <SignUpPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onAgreement={this.handleAgreement}
        onLoggedIn={this.handleLoggedIn}
        onDismissModal={this.props.closeModal}
        loading={this.state.loading}
        errors={this.state.errors}
        disabled={this.state.disabled}
        modal={this.props.modal}
      />
    );
  }
}

SignUp.defaultProps = {
  modal: false,
};

SignUp.propTypes = {
  modal: PropTypes.bool,
  onLoggedIn: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
};

export default connect(null, { closeModal })(SignUp);
