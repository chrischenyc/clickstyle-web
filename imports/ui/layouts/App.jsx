import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../../modules/client/redux/store';

import AuthRoute from '../components/AuthRoute';
import PublicRoute from '../components/PublicRoute';
import Header from '../components/Header';
import Footer from '../components/Footer';

import HomePage from '../layouts/home/HomePage';
import NotFound from '../layouts/NotFound';

import LoginPage from '../layouts/user/LoginPage';
import SignUpPage from '../layouts/user/SignUpPage';
import VerifyEmail from '../layouts/user/VerifyEmail';
import Dashboard from '../layouts/user/Dashboard';
import Profile from '../layouts/user/Profile';
import Settings from '../layouts/user/Settings';

import BookingsPage from '../layouts/bookings/BookingsPage';
import ViewBooking from '../layouts/bookings/ViewBooking';
import NewBooking from '../layouts/bookings/NewBooking';
import EditBooking from '../layouts/bookings/EditBooking';

const App = () => (
  <Router>
    <Provider store={store}>
      <div>
        <Header />

        <Switch>
          <Route exact path="/" component={HomePage} />

          <PublicRoute path="/login" component={LoginPage} />
          <PublicRoute path="/signup" component={SignUpPage} />
          <Route name="verify-email" path="/verify-email/:token" component={VerifyEmail} />

          <AuthRoute exact path="/dashboard" component={Dashboard} />
          <AuthRoute exact path="/profile" component={Profile} />
          <AuthRoute exact path="/settings" component={Settings} />

          <Route exact path="/bookings" component={BookingsPage} />
          <Route exact path="/bookings/new" component={NewBooking} />
          <Route exact path="/bookings/:_id" component={ViewBooking} />
          <AuthRoute exact path="/bookings/:_id/edit" component={EditBooking} />

          <Route component={NotFound} />
        </Switch>

        <Footer />
      </div>
    </Provider>
  </Router>
);

export default App;
