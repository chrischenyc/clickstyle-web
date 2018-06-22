import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { Responsive } from 'semantic-ui-react';
import { Helmet } from 'react-helmet';

import { userSignedIn, userSignedOut, userProfileFetched } from '../modules/client/redux/user';
import Profiles from '../api/profiles/profiles';

import Routes from './Routes';
import SlideMenu from './components/SlideMenu/SlideMenu';

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
          if (user.roles) {
            // the initial Meteor user object may not contain .roles

            this.props.userSignedIn(user);

            const handle = Meteor.subscribe('profiles.self');
            if (handle.ready()) {
              const profile = Profiles.findOne({});
              if (profile) {
                this.props.userProfileFetched(profile);
              }
            }
          }
        } else {
          this.props.userSignedOut();
        }
      }
    });
  }

  render() {
    return (
      <Router>
        <div id="outer-container">
          <Helmet>
            <title>ClickStyle - professional beauty service anywhere you want</title>
          </Helmet>
          <Responsive maxWidth={1024} as={SlideMenu} />

          <main id="page-wrap">
            <ScrollToTop />

            <Routes />
          </main>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
  userSignedOut: PropTypes.func.isRequired,
  userProfileFetched: PropTypes.func.isRequired,
};

export default connect(
  null,
  {
    userSignedIn,
    userSignedOut,
    userProfileFetched,
  },
)(App);
