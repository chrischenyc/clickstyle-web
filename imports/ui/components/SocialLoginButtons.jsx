import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const facebookLogin = () => {
  Meteor.loginWithFacebook({
    requestPermissions: ['email'],
    loginStyle: 'popup',
  });
};

const googleLogin = () => {
  Meteor.loginWithGoogle({
    requestPermissions: ['email', 'profile'],
    requestOfflineToken: true,
    loginStyle: 'popup',
  });
};

const SocialLoginButtons = ({ isSignUp, disabled }) => (
  <div>
    <Button
      fluid
      color="facebook"
      size="huge"
      disabled={disabled}
      style={{ marginBottom: '1rem' }}
      onClick={() => {
        facebookLogin();
      }}
    >
      <Icon name="facebook f" />
      {isSignUp ? 'Sign up with Facebook' : 'Log in with Facebook'}
    </Button>

    <Button
      fluid
      color="grey"
      basic
      size="huge"
      disabled={disabled}
      style={{ marginBottom: '0.5rem' }}
      onClick={() => {
        googleLogin();
      }}
    >
      <Icon name="google" color="red" />
      {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
    </Button>
  </div>
);

SocialLoginButtons.defaultProps = {
  isSignUp: false,
  disabled: false,
};

SocialLoginButtons.propTypes = {
  isSignUp: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default SocialLoginButtons;
