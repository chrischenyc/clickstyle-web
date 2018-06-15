import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { setNextRoute } from '../../modules/client/redux/ui';
import { withMediaQuery } from './HOC';

const SecureLink = props => (
  <Link
    {..._.omit(props, ['authenticated', 'setNextRoute'])}
    onClick={(e) => {
      if (!props.authenticated) {
        e.preventDefault();

        props.setNextRoute(props.to);
        props.history.push('/login');
      }
    }}
  />
);

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  setNextRoute: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  screenWidth: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default connect(
  mapStateToProps,
  { setNextRoute },
)(withMediaQuery(SecureLink));
