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
      activities: [],
      bookings: [],
    };
  }

  componentDidMount() {
    Meteor.call('users.dashboardContent', (error, response) => {
      if (error) {
        this.setState({ error: error.error });
      } else {
        const { messages, activities, bookings } = response;
        this.setState({
          error: '',
          messages,
          activities,
          bookings,
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
        activities={this.state.activities}
        bookings={this.state.bookings}
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
