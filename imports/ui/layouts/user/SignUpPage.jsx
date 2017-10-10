import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userSignedIn } from '../../../redux/user';
import { validateUserSignUp } from '../../../validators/user';
import SignUpForm from './SignUpForm';

// platform-independent stateful container component
// to handle SignUp logic
class SignUpPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirm: '',
      errors: {},
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateUserSignUp(this.state.email, this.state.password, this.state.confirm);

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      // TODO: change to sign up
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

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    return (
      <SignUpForm
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.loading}
        errors={this.state.errors}
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
