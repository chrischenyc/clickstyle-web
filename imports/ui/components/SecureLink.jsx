import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Login from '../layouts/user/Login/Login';
import { openModal } from '../../modules/client/redux/modal';

class SecureLink extends Component {
  render() {
    return (
      <Link
        {..._.omit(this.props, ['authenticated', 'dispatch'])}
        onClick={(e) => {
          if (!this.props.authenticated) {
            e.preventDefault();
            this.props.openModal('/login', <Login />, 'Log in to continue');
          }
        }}
      />
    );
  }
}

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { openModal })(SecureLink);
