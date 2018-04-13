import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DashboardPage from './DashboardPage';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      messages: [],
      recentActivities: [],
      upcomingBookings: [],
    };
  }

  componentDidMount() {
    Meteor.call('users.dashboardContent', (error, response) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        const { messages } = response;
        this.setState({
          error: '',
          messages,
        });
      }
    });

    Meteor.call('users.bookings.upcoming', (error, upcomingBookings) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        this.setState({
          error: '',
          upcomingBookings,
        });
      }
    });

    Meteor.call('users.activities.recent', (error, recentActivities) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        this.setState({
          error: '',
          recentActivities,
        });
      }
    });
  }

  render() {
    return (
      <DashboardPage
        firstName={this.props.firstName}
        error={this.state.error}
        messages={this.state.messages}
        recentActivities={this.state.recentActivities}
        upcomingBookings={this.state.upcomingBookings}
      />
    );
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
