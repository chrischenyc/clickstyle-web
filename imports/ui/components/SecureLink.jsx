import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Login from '../layouts/user/Login/Login';
import { openModal, setNextRoute } from '../../modules/client/redux/ui';
import { withMediaQuery } from './HOC';

const SecureLink = props => (
  <Link
    {..._.omit(props, ['authenticated', 'openModal', 'setNextRoute'])}
    onClick={(e) => {
      if (!props.authenticated) {
        e.preventDefault();

        // on mobile, push to login instead of opening a modal
        // as modal form cursor doesn't work well on mobile scrolling
        if (props.screenWidth <= 1024) {
          props.setNextRoute(props.to);
          props.history.push('/login');
        } else {
          props.openModal(<Login modal />, 'Log in to continue');
        }
      }
    }}
  />
);

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  setNextRoute: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  screenWidth: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { openModal, setNextRoute })(withMediaQuery(SecureLink));
