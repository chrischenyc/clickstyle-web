import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { userSignedIn } from '../../../../modules/client/redux/user';
import { validateResetPassword } from '../../../../modules/validate';
import ResetPasswordPage from './ResetPasswordPage';

// platform-independent stateful container component
// to handle Login logic
class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: null,
      confirm: null,
      errors: {},
      loading: false,
      success: false,
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.setState({
      errors: {},
      loading: false,
      success: false,
      redirect: false,
    });
    event.preventDefault();

    const errors = validateResetPassword(this.state.password, this.state.confirm);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      Accounts.resetPassword(this.props.match.params.token, this.state.password, (error) => {
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
            success: true,
          });

          this.props.userSignedIn(Meteor.user());

          setTimeout(() => {
            this.setState({ redirect: true });
          }, 1500);
        }
      });
    }
  }

  render() {
    return (
      <ResetPasswordPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.loading}
        errors={this.state.errors}
        success={this.state.success}
        redirect={this.state.redirect}
      />
    );
  }
}

ResetPassword.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  userSignedIn: (user) => {
    dispatch(userSignedIn(user));
  },
});
export default connect(null, mapDispatchToProps)(ResetPassword);
