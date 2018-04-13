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
      notifications: [],
      recentActivities: [],
      upcomingBookings: [],
    };

    this.handleDismissNotification = this.handleDismissNotification.bind(this);
  }

  componentDidMount() {
    this.loadNotifications();

    Meteor.call('bookings.upcoming', (error, upcomingBookings) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        this.setState({
          error: '',
          upcomingBookings,
        });
      }
    });

    Meteor.call('booking.activities.recent', (error, recentActivities) => {
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

  loadNotifications() {
    Meteor.call('notifications.list', (error, notifications) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        this.setState({
          error: '',
          notifications,
        });
      }
    });
  }

  handleDismissNotification(_id) {
    this.setState({
      notifications: this.state.notifications.filter(notification => notification._id !== _id),
    });

    Meteor.call('notifications.dismiss', _id, (error) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        this.loadNotifications();
      }
    });
  }

  render() {
    return (
      <DashboardPage
        firstName={this.props.firstName}
        error={this.state.error}
        notifications={this.state.notifications}
        recentActivities={this.state.recentActivities}
        upcomingBookings={this.state.upcomingBookings}
        onDismissNotification={this.handleDismissNotification}
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
