import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const facebookLogin = (callback) => {
  Meteor.loginWithFacebook(
    {
      requestPermissions: ['email'],
      loginStyle: 'popup',
    },
    callback,
  );
};

const googleLogin = (callback) => {
  Meteor.loginWithGoogle(
    {
      requestPermissions: ['email', 'profile'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
    callback,
  );
};

const SocialLoginButtons = ({ isSignUp, callback }) => (
  <div>
    <Button
      fluid
      color="facebook"
      size="huge"
      style={{ marginBottom: '1em' }}
      onClick={() => {
        facebookLogin(callback);
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
      style={{ marginBottom: '0.5em' }}
      onClick={() => {
        googleLogin(callback);
      }}
    >
      <Icon name="google" color="red" />
      {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
    </Button>
  </div>
);

SocialLoginButtons.propTypes = {
  isSignUp: PropTypes.bool.isRequired,
  callback: PropTypes.func.isRequired,
};

SocialLoginButtons.defaultProps = {
  isSignUp: false,
};

export default SocialLoginButtons;
