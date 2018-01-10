import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Responsive } from 'semantic-ui-react';

import Login from '../layouts/user/Login/Login';
import { openModal, setNextRoute } from '../../modules/client/redux/ui';

class SecureLink extends Component {
  constructor(props) {
    super(props);
    this.state = { width: props.width };
  }

  componentWillMount() {
    this.setState({ width: window.innerWidth });
  }

  render() {
    return (
      <Link
        {..._.omit(this.props, [
          'onLoggedIn',
          'authenticated',
          'dispatch',
          'openModal',
          'setNextRoute',
        ])}
        onClick={(e) => {
          if (!this.props.authenticated) {
            e.preventDefault();

            // on mobile, push to login instead of opening a modal
            // as modal form cursor doesn't work well on mobile scrolling
            if (this.state.width <= Responsive.onlyMobile.maxWidth) {
              this.props.setNextRoute(this.props.to);
              this.props.history.push('/login');
            } else {
              this.props.openModal(
                <Login modal onLoggedIn={this.props.onLoggedIn} />,
                'Log in to continue',
              );
            }
          }
        }}
      />
    );
  }
}

SecureLink.defaultProps = {
  onLoggedIn: null,
};

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  onLoggedIn: PropTypes.func,
  authenticated: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
  setNextRoute: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { openModal, setNextRoute })(SecureLink);
