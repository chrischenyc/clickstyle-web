import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DashboardPage from './DashboardPage';

class Dashboard extends Component {
  render() {
    return <DashboardPage firstName={this.props.firstName} isStylist={this.props.isStylist} />;
  }
}

Dashboard.defaultProps = {
  firstName: '',
  isStylist: false,
};

Dashboard.propTypes = {
  firstName: PropTypes.string,
  isStylist: PropTypes.bool,
};

const mapStateToProps = state => ({
  firstName: state.user.profile && state.user.profile.name && state.user.profile.name.first,
  isStylist: state.user.isStylist,
});

export default connect(mapStateToProps)(Dashboard);
