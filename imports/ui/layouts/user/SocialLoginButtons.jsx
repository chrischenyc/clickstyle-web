import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';

const SocialLoginButtons = ({ isSignUp, onFacebook, onGoogle }) => (
  <div>
    <Button fluid color="facebook" size="huge" style={{ marginBottom: '1em' }} onClick={onFacebook}>
      <Icon name="facebook f" />
      {isSignUp ? 'Sign up with Facebook' : 'Log in with Facebook'}
    </Button>

    <Button fluid color="grey" basic size="huge" style={{ marginBottom: '1em' }} onClick={onGoogle}>
      <Icon name="google" color="red" />
      {isSignUp ? 'Sign up with Google' : 'Log in with Google'}
    </Button>
  </div>
);

SocialLoginButtons.propTypes = {
  isSignUp: PropTypes.bool.isRequired,
  onFacebook: PropTypes.func.isRequired,
  onGoogle: PropTypes.func.isRequired,
};

SocialLoginButtons.defaultProps = {
  isSignUp: false,
};

export default SocialLoginButtons;
