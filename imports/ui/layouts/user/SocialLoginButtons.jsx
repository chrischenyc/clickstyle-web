import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const facebookLogin = () => {
  Meteor.loginWithFacebook(
    {
      requestPermissions: ['email'],
      loginStyle: 'popup',
    },
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('facebook signed in');
      }
    },
  );
};

const googleLogin = () => {
  Meteor.loginWithGoogle(
    {
      requestPermissions: ['email', 'profile'],
      requestOfflineToken: true,
      loginStyle: 'popup',
    },
    (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('google signed in');
      }
    },
  );
};

const SocialLoginButtons = ({ isSignUp }) => (
  <div>
    <Button
      fluid
      color="facebook"
      size="huge"
      style={{ marginBottom: '1em' }}
      onClick={facebookLogin}
    >
      <Icon name="facebook f" />
      {isSignUp ? 'Sign up with Facebook' : 'Log in with Facebook'}
    </Button>

    <Button
      fluid
      color="grey"
      basic
      size="huge"
      style={{ marginBottom: '1em' }}
      onClick={googleLogin}
    >
      <Icon name="google" color="red" />
      {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
    </Button>
  </div>
);

SocialLoginButtons.propTypes = {
  isSignUp: PropTypes.bool.isRequired,
};

SocialLoginButtons.defaultProps = {
  isSignUp: false,
};

export default SocialLoginButtons;
