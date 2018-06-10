import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import { Responsive } from 'semantic-ui-react';

import {
  userSignedIn,
  userSignedOut,
  userProfileFetched,
  userStatsFetched,
} from '../modules/client/redux/user';
import { resetCart } from '../modules/client/redux/cart';
import Profiles from '../api/profiles/profiles';
import UserStats from '../api/user_stats/user_stats';

import Routes from './Routes';
import SlideMenu from './components/SlideMenu';
import ModalContainer from './components/ModalContainer';

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

          Meteor.subscribe('profiles.self');
          const profile = Profiles.findOne({});
          if (profile) {
            this.props.userProfileFetched(profile);
          }

          // FIXME: merge UserStats with Profiles
          const handle = Meteor.subscribe('userStats');
          if (handle.ready()) {
            const stats = UserStats.findOne({ owner: user._id });
            this.props.userStatsFetched(stats);
          }
        } else {
          this.props.userSignedOut();
          this.props.resetCart();
        }
      }
    });
  }

  render() {
    return (
      <Router>
        <div id="outer-container">
          <Responsive maxWidth={1024} as={SlideMenu} />

          <main id="page-wrap">
            <ScrollToTop />

            <Routes />

            {this.props.modalOpen && <ModalContainer />}
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
  userStatsFetched: PropTypes.func.isRequired,
  resetCart: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  modalOpen: state.ui.modalOpen,
});

export default connect(
  mapStateToProps,
  {
    userSignedIn,
    userSignedOut,
    userProfileFetched,
    userStatsFetched,
    resetCart,
  },
)(App);
