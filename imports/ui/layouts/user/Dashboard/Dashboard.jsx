import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DashboardPage from './DashboardPage';

class Dashboard extends Component {
  render() {
    return <DashboardPage firstName={this.props.firstName} />;
  }
}

Dashboard.defaultProps = {
  firstName: '',
};

Dashboard.propTypes = {
  firstName: PropTypes.string,
};

const mapStateToProps = state => ({
  firstName: state.user.profile && state.user.profile.name && state.user.profile.name.first,
});

export default connect(mapStateToProps)(Dashboard);
