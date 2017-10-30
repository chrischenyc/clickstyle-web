import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Login from '../layouts/user/Login/Login';
import { openModal } from '../../modules/client/redux/modal';

const SecureLink = props => (
  <Link
    {..._.omit(props, ['authenticated', 'dispatch', 'openModal'])}
    onClick={(e) => {
      if (!props.authenticated) {
        e.preventDefault();

        // TODO: close modal after user sign in, push to props.to
        props.openModal('/login', <Login />, 'Log in to continue');
      }
    }}
  />
);

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { openModal })(SecureLink);
