import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button, Message } from 'semantic-ui-react';

const EmailVerificationAlertPage = ({
  onSubmit, error, success, loading,
}) => (
  <div className="centered-content margin-top-10">
    <Message warning compact>
      <p>
        <b>You account email has not been verified.</b>
      </p>
      <p>
        Please check your email inbox for a verification email sent from&nbsp;
        {Meteor.settings.public.supportEmail}.
      </p>
      <p>
        You can request to&nbsp;
        <Button circular compact size="small" onClick={onSubmit} loading={loading}>
          re-send verification email
        </Button>
      </p>

      {!_.isEmpty(error) && <p>{error}</p>}

      {success && <p>verification email sent, please check your inbox!</p>}
    </Message>
  </div>
);

EmailVerificationAlertPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default EmailVerificationAlertPage;
