import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Responsive } from 'semantic-ui-react';

import Login from '../layouts/user/Login/Login';
import { openModal } from '../../modules/client/redux/modal';

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
        {..._.omit(this.props, ['onLoggedIn', 'authenticated', 'dispatch', 'openModal'])}
        onClick={(e) => {
          if (!this.props.authenticated) {
            e.preventDefault();

            // on mobile, push to login instead of opening a modal
            if (this.state.width <= Responsive.onlyMobile.maxWidth) {
              this.props.history.push('/login');
            } else {
              this.props.openModal(
                this.props.to,
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
  history: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { openModal })(SecureLink);
