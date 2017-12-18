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
import PublicRoute from '../components/PublicRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SlideMenu from '../components/SlideMenu';
import ModalContainer from '../components/ModalContainer';

import Home from '../layouts/home/Home';
import NotFoundPage from '../layouts/NotFoundPage';
import Contact from '../layouts/contact/Contact';

import UserProfile from '../layouts/user-profile/UserProfile';

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

import Search from '../layouts/search/Search';

import StylistsJoin from '../layouts/stylists/StylistsJoinPage';
import StylistsApplication from '../layouts/stylists/StylistsApplication';
import StylistServices from '../layouts/stylists/StylistServices/StylistServices';
import StylistAvailability from '../layouts/stylists/StylistAvailability/StylistAvailability';
import StylistAvailableAreas from '../layouts/stylists/StylistAvailableAreas/StylistAvailableAreas';

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
        <div id="outer-container">
          <SlideMenu />

          <main id="page-wrap">
            <ScrollToTop />
            <Header />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/stylists/:service?/:suburb?/:postcode?" component={Search} />
              <Route path="/users/show/:_id" component={UserProfile} />
              <Route path="/contact" component={Contact} />
              <Route path="/join" component={StylistsJoin} />

              <PublicRoute path="/login" component={Login} />
              <PublicRoute path="/signup" component={SignUp} />
              <Route path="/verify-email/:token" component={VerifyEmailPage} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/reset-password/:token" component={ResetPassword} />

              <SecureRoute path="/users/dashboard" component={DashboardPage} />
              <SecureRoute path="/users/profile" component={EditProfile} />
              <SecureRoute path="/users/inbox" component={InboxPage} />
              <SecureRoute path="/users/settings" component={SettingsPage} />
              <SecureRoute path="/users/settings/change-password" component={ChangePassword} />
              <SecureRoute path="/users/stylist/application" component={StylistsApplication} />
              <SecureRoute path="/users/stylist/services" component={StylistServices} />
              <SecureRoute path="/users/stylist/calendar" component={StylistAvailability} />
              <SecureRoute path="/users/stylist/areas" component={StylistAvailableAreas} />

              <Route component={NotFoundPage} />
            </Switch>

            {this.props.modalOpen && <Route to="/modal" component={ModalContainer} />}

            <Footer />
          </main>
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
