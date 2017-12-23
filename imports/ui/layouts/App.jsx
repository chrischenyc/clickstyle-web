import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Responsive } from 'semantic-ui-react';

import Profiles from '../../api/profiles/profiles';
import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';
import { fetchProfile } from '../../modules/client/redux/profile';

import PublicRoute from '../components/PublicRoute';
import SecureRoute from '../components/SecureRoute';

import SlideMenu from '../components/SlideMenu';
import {
  withHeaderAndFooter,
  withSearchHeaderAndFooter,
  withSideMenuAndHeader,
} from '../components/HOC';
import ModalContainer from '../components/ModalContainer';
import NotFoundPage from '../layouts/NotFoundPage';

import Home from '../layouts/home/Home';
import Contact from '../layouts/contact/Contact';
import UserProfile from '../layouts/user-profile/UserProfile';
import Login from '../layouts/user/Login/Login';
import SignUp from '../layouts/user/SignUp/SignUp';
import VerifyEmailPage from '../layouts/user/VerifyEmailPage';
import ForgotPassword from '../layouts/user/ForgotPassword/ForgotPassword';
import ResetPassword from '../layouts/user/ResetPassword/ResetPassword';
import Search from '../layouts/search/Search';
import StylistsJoin from '../layouts/stylists/StylistsJoinPage';

import Dashboard from '../layouts/user/DashboardPage';
import EditProfile from '../layouts/user/Profile/EditProfile';
import SettingsPage from '../layouts/user/SettingsPage';
import ChangePassword from '../layouts/user/ChangePassword/ChangePassword';
import InboxPage from '../layouts/user/InboxPage';

import FavouredStylists from '../layouts/user/FavouredStylists/FavouredStylists';

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
          <Responsive maxWidth={1024} as={SlideMenu} />

          <main id="page-wrap">
            <ScrollToTop />

            <Switch>
              <Route exact path="/" component={withHeaderAndFooter(Home)} />
              <Route
                path="/stylists/:service?/:suburb?/:postcode?"
                component={withSearchHeaderAndFooter(Search)}
              />
              <Route path="/users/show/:_id" component={withHeaderAndFooter(UserProfile)} />
              <Route path="/contact" component={withHeaderAndFooter(Contact)} />
              <Route path="/join" component={withHeaderAndFooter(StylistsJoin)} />

              <PublicRoute path="/login" component={withHeaderAndFooter(Login)} />
              <PublicRoute path="/signup" component={withHeaderAndFooter(SignUp)} />
              <Route path="/verify-email/:token" component={withHeaderAndFooter(VerifyEmailPage)} />
              <Route path="/forgot-password" component={withHeaderAndFooter(ForgotPassword)} />
              <Route path="/reset-password/:token" component={withHeaderAndFooter(ResetPassword)} />

              <SecureRoute path="/users/dashboard" component={withSideMenuAndHeader(Dashboard)} />
              <SecureRoute path="/users/profile" component={withSideMenuAndHeader(EditProfile)} />
              <SecureRoute path="/users/inbox" component={withSideMenuAndHeader(InboxPage)} />
              <SecureRoute path="/users/settings" component={withSideMenuAndHeader(SettingsPage)} />
              <SecureRoute
                path="/users/change-password"
                component={withSideMenuAndHeader(ChangePassword)}
              />
              <SecureRoute
                path="/users/reset-password"
                component={withSideMenuAndHeader(ForgotPassword)}
              />
              <SecureRoute
                path="/users/booking/stylists"
                component={withSideMenuAndHeader(FavouredStylists)}
              />
              <SecureRoute
                path="/users/stylist/application"
                component={withSideMenuAndHeader(StylistsApplication)}
              />
              <SecureRoute
                path="/users/stylist/services"
                component={withSideMenuAndHeader(StylistServices)}
              />
              <SecureRoute
                path="/users/stylist/calendar"
                component={withSideMenuAndHeader(StylistAvailability)}
              />
              <SecureRoute
                path="/users/stylist/areas"
                component={withSideMenuAndHeader(StylistAvailableAreas)}
              />

              <Route component={withHeaderAndFooter(NotFoundPage)} />
            </Switch>

            {this.props.modalOpen && <Route to="/modal" component={ModalContainer} />}
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
