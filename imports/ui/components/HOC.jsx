import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

import EmailVerificationAlert from './EmailVerificationAlert/EmailVerificationAlert';
import Header from './Header';
import Footer from './Footer';
import SideMenu from './SideMenu';

export const withHeaderAndFooter = WrappedComponent => props => (
  <div>
    <Header />
    <WrappedComponent {...props} />
    <Footer />
  </div>
);

export const withSearchHeaderAndFooter = WrappedComponent => props => (
  <div>
    <Header searchBar />
    <WrappedComponent {...props} />
    <Footer />
  </div>
);

export const withSideMenuAndHeader = WrappedComponent => props => (
  <div id="dashboard">
    <SideMenu />
    <div className="dashboard-content">
      <Header fullContent={false} />

      <EmailVerificationAlert />

      <div className="margin-top-50">
        <WrappedComponent {...props} />
      </div>
    </div>
  </div>
);

export const withLoading = (WrappedComponent) => {
  const hoc = props => <WrappedComponent {...props} />;

  hoc.propTypes = {
    showLoading: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
  };

  return connect(null, { showLoading, hideLoading })(hoc);
};

export const withMediaQuery = WrappedComponent =>
  class extends Component {
    componentWillMount() {
      this.setState({ screenWidth: window.innerWidth });
    }

    render() {
      return <WrappedComponent screenWidth={this.state.screenWidth} {...this.props} />;
    }
  };
