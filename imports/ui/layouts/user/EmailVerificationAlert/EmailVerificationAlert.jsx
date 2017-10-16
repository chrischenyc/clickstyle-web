import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EmailVerificationAlertPage from './EmailVerificationAlertPage';

class EmailVerificationAlert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      success: false,
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({ loading: true });

    Meteor.call('users.sendVerificationEmail', (error) => {
      if (error) {
        this.setState({ error, loading: false });
      } else {
        this.setState({ success: true, loading: false });
      }
    });
  }

  render() {
    if (this.props.verified === undefined || this.props.verified === true) {
      return '';
    }
    return (
      <EmailVerificationAlertPage
        onSubmit={this.handleSubmit}
        error={this.state.error}
        success={this.state.success}
        loading={this.state.loading}
      />
    );
  }
}

EmailVerificationAlert.defaultProps = {
  verified: undefined,
};

EmailVerificationAlert.propTypes = {
  verified: PropTypes.bool,
};

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();

  return {
    loggingIn,
    user,
    verified:
      !loggingIn && user && user.emails && user.emails.length > 0 && user.emails[0].verified,
  };
})(EmailVerificationAlert);
