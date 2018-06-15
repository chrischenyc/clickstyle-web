import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AuthenticatedRoute from './components/AuthenticatedRoute';
import AuthenticatedStylistRoute from './components/AuthenticatedStylistRoute';
import {
  withHeaderAndFooter,
  withSearchHeaderAndFooter,
  withSideMenuAndHeader,
} from './components/HOC';

import NotFoundPage from './layouts/NotFoundPage';
import Home from './layouts/home/Home';
import Contact from './layouts/contact/Contact';
import UserProfile from './layouts/user-profile/UserProfile';
import Login from './layouts/user/Login/Login';
import SignUp from './layouts/user/SignUp/SignUp';
import VerifyEmailPage from './layouts/user/VerifyEmailPage';
import ForgotPassword from './layouts/user/ForgotPassword/ForgotPassword';
import ResetPassword from './layouts/user/ResetPassword/ResetPassword';
import Search from './layouts/search/Search';
import StylistsJoin from './layouts/stylists/StylistsJoinPage';

import BookingCheckout from './layouts/booking/BookingCheckout/BookingCheckout';
import BookingRequested from './layouts/booking/BookingRequested/BookingRequested';
import CustomerBooking from './layouts/booking/CustomerBooking/CustomerBooking';
import CustomerBookings from './layouts/booking/CustomerBookings/CustomerBookings';
import StylistBooking from './layouts/booking/StylistBooking/StylistBooking';
import StylistBookings from './layouts/booking/StylistBookings/StylistBookings';

import Dashboard from './layouts/user/Dashboard/Dashboard';
import EditProfile from './layouts/user/Profile/EditProfile';
import SettingsPage from './layouts/user/SettingsPage';
import ChangePassword from './layouts/user/ChangePassword/ChangePassword';
import Conversations from './layouts/user/Conversations/Conversations';
import Conversation from './layouts/user/Conversation/Conversation';
import PaymentMethods from './layouts/user/PaymentMethods/PaymentMethods';

import FavouredStylists from './layouts/user/FavouredStylists/FavouredStylists';

import StylistsApplication from './layouts/stylists/StylistsApplication';
import StylistServices from './layouts/stylists/StylistServices/StylistServices';
import StylistAvailability from './layouts/stylists/StylistAvailability/StylistAvailability';
import StylistAvailableAreas from './layouts/stylists/StylistAvailableAreas/StylistAvailableAreas';
import StylistPortfolio from './layouts/stylists/StylistPortfolio/StylistPortfolio';

import TermsPage from './layouts/static/TermsPage';
import PrivacyPage from './layouts/static/PrivacyPage';
import FAQPage from './layouts/static/FAQPage';
import AboutPage from './layouts/static/AboutPage';
import StylistFAQPage from './layouts/static/StylistFAQPage';

export default () => (
  <Switch>
    <Route exact path="/" component={withHeaderAndFooter(Home)} />
    <Route
      path="/stylists/:service?/:suburb?/:postcode?"
      component={withSearchHeaderAndFooter(Search)}
    />
    <Route path="/users/show/:_id/:name?" component={withHeaderAndFooter(UserProfile)} />
    <Route path="/contact" component={withHeaderAndFooter(Contact)} />
    <Route path="/join" component={withHeaderAndFooter(StylistsJoin)} />
    <Route path="/terms" component={withHeaderAndFooter(TermsPage)} />
    <Route path="/privacy" component={withHeaderAndFooter(PrivacyPage)} />
    <Route path="/faq" component={withHeaderAndFooter(FAQPage)} />
    <Route path="/about" component={withHeaderAndFooter(AboutPage)} />

    <Route path="/booking" component={withHeaderAndFooter(BookingCheckout)} />
    <Route
      path="/booking-requested/:_id/:userId?"
      component={withHeaderAndFooter(BookingRequested)}
    />

    <Route path="/login" component={withHeaderAndFooter(Login)} />
    <Route path="/signup" component={withHeaderAndFooter(SignUp)} />

    <Route path="/verify-email/:token" component={withHeaderAndFooter(VerifyEmailPage)} />
    <Route path="/forgot-password" component={withHeaderAndFooter(ForgotPassword)} />
    <Route path="/reset-password/:token" component={withHeaderAndFooter(ResetPassword)} />
    <Route path="/enroll-account/:token" component={withHeaderAndFooter(ResetPassword)} />

    <AuthenticatedRoute path="/users/dashboard" component={withSideMenuAndHeader(Dashboard)} />
    <AuthenticatedRoute path="/users/profile" component={withSideMenuAndHeader(EditProfile)} />
    <AuthenticatedRoute path="/users/inbox" component={withSideMenuAndHeader(Conversations)} />
    <AuthenticatedRoute
      path="/users/conversations/:_id"
      component={withSideMenuAndHeader(Conversation)}
    />
    <AuthenticatedRoute
      path="/users/payment-methods"
      component={withSideMenuAndHeader(PaymentMethods)}
    />
    <AuthenticatedRoute path="/users/settings" component={withSideMenuAndHeader(SettingsPage)} />
    <AuthenticatedRoute
      path="/users/change-password"
      component={withSideMenuAndHeader(ChangePassword)}
    />
    <AuthenticatedRoute
      path="/users/booking/stylists"
      component={withSideMenuAndHeader(FavouredStylists)}
    />
    <AuthenticatedRoute
      exact
      path="/users/bookings"
      component={withSideMenuAndHeader(CustomerBookings)}
    />
    <AuthenticatedRoute
      path="/users/bookings/:_id"
      component={withSideMenuAndHeader(CustomerBooking)}
    />
    <AuthenticatedRoute
      path="/users/stylist/application"
      component={withHeaderAndFooter(StylistsApplication)}
    />
    <AuthenticatedStylistRoute
      path="/users/stylist/services"
      component={withSideMenuAndHeader(StylistServices)}
    />
    <AuthenticatedStylistRoute
      path="/users/stylist/calendar"
      component={withSideMenuAndHeader(StylistAvailability)}
    />
    <AuthenticatedStylistRoute
      path="/users/stylist/areas"
      component={withSideMenuAndHeader(StylistAvailableAreas)}
    />
    <AuthenticatedStylistRoute
      path="/users/stylist/portfolio"
      component={withSideMenuAndHeader(StylistPortfolio)}
    />
    <AuthenticatedStylistRoute
      exact
      path="/users/stylist/bookings"
      component={withSideMenuAndHeader(StylistBookings)}
    />
    <AuthenticatedStylistRoute
      path="/users/stylist/bookings/:_id"
      component={withSideMenuAndHeader(StylistBooking)}
    />
    <AuthenticatedStylistRoute
      path="/users/stylist/faq"
      component={withSideMenuAndHeader(StylistFAQPage)}
    />

    <Route component={withHeaderAndFooter(NotFoundPage)} />
  </Switch>
);
