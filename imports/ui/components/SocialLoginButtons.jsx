import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';

import { userSignedIn } from '../../modules/client/redux/user';

const SocialLoginButtons = props => (
  <Fragment>
    <Button
      circular
      fluid
      color="facebook"
      size="huge"
      disabled={props.disabled}
      style={{ marginBottom: '1rem' }}
      onClick={() => {
        Meteor.loginWithFacebook(
          {
            requestPermissions: ['email'],
            loginStyle: 'popup',
          },
          (error) => {
            if (!error) {
              if (props.onSocialSignedIn) {
                props.onSocialSignedIn();
              }
            }
          },
        );
      }}
    >
      {props.isSignUp ? 'Sign up with Facebook' : 'Log in with Facebook'}
    </Button>

    <Button
      circular
      fluid
      color="grey"
      basic
      size="huge"
      disabled={props.disabled}
      style={{ marginBottom: '0.5rem' }}
      onClick={() => {
        Meteor.loginWithGoogle(
          {
            requestPermissions: ['email', 'profile'],
            requestOfflineToken: true,
            loginStyle: 'popup',
          },
          (error) => {
            if (!error) {
              if (props.onSocialSignedIn) {
                props.onSocialSignedIn();
              }
            } else {
              /* eslint-disable no-console */
              console.error(`Google sign in error: ${error}`);
              /* eslint-enable no-console */
            }
          },
        );
      }}
    >
      {props.isSignUp ? 'Sign up with Google' : 'Log in with Google'}
    </Button>
  </Fragment>
);

SocialLoginButtons.defaultProps = {
  isSignUp: false,
  disabled: false,
};

SocialLoginButtons.propTypes = {
  isSignUp: PropTypes.bool,
  disabled: PropTypes.bool,
  onSocialSignedIn: PropTypes.func.isRequired,
  userSignedIn: PropTypes.func.isRequired,
};

export default connect(null, { userSignedIn })(SocialLoginButtons);
