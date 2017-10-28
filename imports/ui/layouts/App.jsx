import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Profiles from '../../api/profiles/profiles';
import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';
import { fetchProfile } from '../../modules/client/redux/profile';

import AuthRoute from '../components/AuthRoute';
import PublicRoute from '../components/PublicRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenuContainer from '../components/SideMenuContainer';

import HomePage from '../layouts/home/HomePage';
import NotFound from '../layouts/NotFound';

import LoginPage from '../layouts/user/Login/LoginPage';
import SignUpPage from '../layouts/user/SignUp/SignUpPage';
import VerifyEmail from '../layouts/user/VerifyEmail';
import ForgotPassword from '../layouts/user/ForgotPassword/ForgotPassword';
import ResetPassword from '../layouts/user/ResetPassword/ResetPassword';
import ChangePassword from '../layouts/user/ChangePassword/ChangePassword';

import Dashboard from '../layouts/user/Dashboard';
import EditProfile from '../layouts/user/Profile/EditProfile';
import Settings from '../layouts/user/Settings';
import Inbox from '../layouts/user/Inbox';

import BookingsPage from '../layouts/bookings/BookingsPage';
import ViewBooking from '../layouts/bookings/ViewBooking';
import NewBooking from '../layouts/bookings/NewBooking';
import EditBooking from '../layouts/bookings/EditBooking';

import StylesOnboard from '../layouts/stylists/StylistsOnboard';

class App extends Component {
  // after web App is refreshed, try to fetch Meteor user data then update redux states
  componentDidMount() {
    Tracker.autorun(() => {
      // get user login
      const user = Meteor.user();
      if (user !== undefined) {
        if (user) {
          this.props.userSignedIn(user);
        } else {
          this.props.userSignedOut();
        }
      }

      // get user profile
      const handle = Meteor.subscribe('profiles.owner');
      const fetching = !handle.ready();
      const profile = Profiles.findOne({});
      this.props.fetchProfile(fetching, profile);
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Header />

          <Switch>
            <Route exact path="/" component={HomePage} />

            <PublicRoute path="/login" component={LoginPage} />
            <PublicRoute path="/signup" component={SignUpPage} />
            <Route path="/verify-email/:token" component={VerifyEmail} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />

            <AuthRoute
              exact
              path="/dashboard"
              component={() => (
                <SideMenuContainer>
                  <Dashboard />
                </SideMenuContainer>
              )}
            />
            <AuthRoute
              exact
              path="/profile"
              component={() => (
                <SideMenuContainer>
                  <EditProfile />
                </SideMenuContainer>
              )}
            />
            <AuthRoute
              exact
              path="/settings"
              component={() => (
                <SideMenuContainer>
                  <Settings />
                </SideMenuContainer>
              )}
            />
            <AuthRoute
              path="/change-password"
              component={() => (
                <SideMenuContainer>
                  <ChangePassword />
                </SideMenuContainer>
              )}
            />
            <AuthRoute
              path="/inbox"
              component={() => (
                <SideMenuContainer>
                  <Inbox />
                </SideMenuContainer>
              )}
            />

            <Route exact path="/bookings" component={BookingsPage} />
            <AuthRoute
              exact
              path="/bookings/new"
              component={() => (
                <SideMenuContainer>
                  <NewBooking />
                </SideMenuContainer>
              )}
            />
            <Route exact path="/bookings/:_id" component={ViewBooking} />
            <AuthRoute exact path="/bookings/:_id/edit" component={EditBooking} />

            <Route path="/stylists/onboard" component={StylesOnboard} />

            <Route component={NotFound} />
          </Switch>

          <Footer />
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
  userSignedOut: PropTypes.func.isRequired,
  fetchProfile: PropTypes.func.isRequired,
};

export default connect(null, {
  userSignedIn,
  userSignedOut,
  fetchProfile,
})(App);
