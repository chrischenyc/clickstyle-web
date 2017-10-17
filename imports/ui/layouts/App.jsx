import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '../../modules/client/redux/store';

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
import Profile from '../layouts/user/Profile';
import Settings from '../layouts/user/Settings';
import Inbox from '../layouts/user/Inbox';

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
                <Profile />
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
          <AuthRoute
            exact
            path="/bookings/new"
            component={() => (
              <SideMenuContainer>
                <NewBooking />
              </SideMenuContainer>
            )}
          />

          <Route exact path="/bookings" component={BookingsPage} />

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
