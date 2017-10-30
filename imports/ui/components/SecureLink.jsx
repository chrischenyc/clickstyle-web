import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Modal } from 'semantic-ui-react';

import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';

class SecureLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      signup: props.to === '/signup',
    };
  }

  render() {
    return (
      <div>
        <Link
          {..._.omit(this.props, ['authenticated', 'dispatch'])}
          onClick={(e) => {
            if (!this.props.authenticated) {
              e.preventDefault();
              this.setState({ openModal: true });
            }
          }}
        />

        {!this.props.authenticated && (
          <Modal
            size="small"
            open={this.state.openModal}
            closeIcon
            onClose={() => {
              this.setState({ openModal: false });
            }}
          >
            <Modal.Header>{this.state.signup ? 'Join us' : 'Log in to continue'}</Modal.Header>
            <Modal.Content>{this.state.signup ? <SignUp /> : <Login />}</Modal.Content>
          </Modal>
        )}
      </div>
    );
  }
}

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps)(SecureLink);
