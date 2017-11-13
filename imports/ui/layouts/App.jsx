import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Profiles from '../../api/profiles/profiles';
import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';
import { fetchProfile } from '../../modules/client/redux/profile';

import SecureRoute from '../components/SecureRoute';
import SecureStylistRoute from '../components/SecureStylistRoute';
import PublicRoute from '../components/PublicRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ModalContainer from '../components/ModalContainer';

import HomePage from '../layouts/home/HomePage';
import NotFoundPage from '../layouts/NotFoundPage';

import Profile from '../layouts/profiles/Profile';

import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';
import VerifyEmailPage from '../layouts/user/VerifyEmailPage';
import ForgotPassword from '../layouts/user/ForgotPassword/ForgotPassword';
import ResetPassword from '../layouts/user/ResetPassword/ResetPassword';
import ChangePassword from '../layouts/user/ChangePassword/ChangePassword';

import DashboardPage from '../layouts/user/DashboardPage';
import EditProfile from '../layouts/user/Profile/EditProfile';
import SettingsPage from '../layouts/user/SettingsPage';
import InboxPage from '../layouts/user/InboxPage';

import BookingsPage from '../layouts/bookings/BookingsPage';
import ViewBooking from '../layouts/bookings/ViewBooking';
import NewBooking from '../layouts/bookings/NewBooking';
import EditBooking from '../layouts/bookings/EditBooking';

import StylistServices from '../layouts/stylists/StylistServices/StylistServices';

import StylistsHomePage from '../layouts/stylists/StylistsHomePage';
import StylistsJoin from '../layouts/stylists/StylistsJoin';

// scroll to page top when route changes
// https://github.com/ReactTraining/react-router/issues/2019#issuecomment-292711226
const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};

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
          <Route component={ScrollToTop} />
          <Header />

          <Switch>
            <Route exact path="/" component={HomePage} />

            <PublicRoute path="/login" component={Login} />
            <PublicRoute path="/signup" component={SignUp} />
            <Route path="/verify-email/:token" component={VerifyEmailPage} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />

            <SecureRoute path="/profiles/:_id" component={Profile} />

            <SecureRoute exact path="/dashboard" component={DashboardPage} />
            <SecureRoute exact path="/profile" component={EditProfile} />
            <SecureRoute exact path="/settings" component={SettingsPage} />
            <SecureRoute path="/change-password" component={ChangePassword} />
            <SecureRoute
              path="/reset-password"
              component={props => <ForgotPassword {...props} embedded />}
            />
            <SecureRoute path="/inbox" component={InboxPage} />

            <Route exact path="/bookings" component={BookingsPage} />
            <SecureRoute exact path="/bookings/new" component={NewBooking} />
            <SecureRoute exact path="/bookings/:_id" component={ViewBooking} />
            <SecureRoute exact path="/bookings/:_id/edit" component={EditBooking} />

            <Route exact path="/stylists" component={StylistsHomePage} />
            <SecureRoute path="/stylists/join" component={StylistsJoin} />
            <SecureStylistRoute path="/stylists/services" component={StylistServices} />

            <Route component={NotFoundPage} />
          </Switch>

          {this.props.modalOpen && <Route to="/modal" component={ModalContainer} />}

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
  modalOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  modalOpen: state.modal.open,
});

export default connect(mapStateToProps, {
  userSignedIn,
  userSignedOut,
  fetchProfile,
})(App);
