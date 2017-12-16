import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { closeModal } from '../../../modules/client/redux/modal';
import SecureLink from '../../components/SecureLink';

const StylistsJoinPage = props => (
  <div className="container">
    <div className="margin-top-80">
      <div className="row vertical-align">
        <div className="col-lg-6 col-sm-6">
          <div className="centered-content">
            <h2 className="headline">
              Become a stylist and start your business on {Meteor.settings.public.appName}
            </h2>

            <SecureLink
              className="button border"
              history={props.history}
              to="/join/application"
              onLoggedIn={() => {
                props.closeModal();
                props.history.push('/join/application');
              }}
            >
              Get Started
            </SecureLink>
          </div>
        </div>

        <div className="col-lg-6 col-sm-6">
          <img src="images/placeholder-bg.jpg" alt="" />
        </div>
      </div>
    </div>

    <div className="margin-top-80">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2 className="headline centered">
            What is a Stylist?
            <span className="margin-top-20">
              A stylist is a makeup artist, hair stylist, massage therapist, beautician, just about
              any professional beauty service for women and men.
            </span>
          </h2>
        </div>
      </div>
    </div>

    <div className="margin-top-80">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2 className="headline centered">
            Why should I join {Meteor.settings.public.appName}?
            <span className="margin-top-20">
              There are truckloads of reason, but here are some great ones:
            </span>
          </h2>
        </div>
      </div>

      <div className="row icons-container">
        <div className="col-md-3">
          <div className="icon-box-2">
            <i className="im im-icon-Dollar-Sign" />
            <h3>Guaranteed payment for every booking made through our platform</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="icon-box-2">
            <i className="im im-icon-Time-Window" />
            <h3>Be your own boss, set your own prices and time. Earn in your spare time</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="icon-box-2">
            <i className="im im-icon-Handshake" />
            <h3>
              Get paid for no show, after all time is money.
              <Link to="/terms"> Terms &amp; Conditions </Link> apply
            </h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="icon-box-2">
            <i className="im im-icon-Bar-Chart" />
            <h3>
              Strong level of support from us to grow your business and brand locally and nationally
            </h3>
          </div>
        </div>

        <div className="col-md-offset-4 col-md-4">
          <div className="icon-box-2">
            <i className="im im-icon-Pie-Chart2" />
            <h3>
              Beauty service industry in Australia is worth $4.8 billion and growing. How much of
              that share is yours?
            </h3>
          </div>
        </div>
      </div>
    </div>

    <div className="margin-top-80">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2 className="headline centered">
            Who can join {Meteor.settings.public.appName} as a stylist?
            <span className="margin-top-20">
              Anyone has a qualification in the beauty and grooming industry. Unsure if you can
              join? Send in an application anyway and we&apos;ll have a look. You won&apos;t know
              unless you try, who knows you could be the next celebrity stylist?
            </span>
          </h2>
        </div>
      </div>
    </div>

    <div className="margin-top-80">
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2 className="headline centered">How it works</h2>
        </div>
      </div>

      <div className="row icons-container">
        <div className="col-md-4">
          <div className="icon-box-2 with-line">
            <i className="im im-icon-Business-ManWoman" />
            <h3>Create your business listing</h3>
            <p>
              It&apos;s free and easy to create your listing, simply fill in your profile details,
              services you will provide and price.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="icon-box-2 with-line">
            <i className="im im-icon-Waiter" />
            <h3>Provide service</h3>
            <p>
              Attend your clients at their desired locations, whether at home or work and do your
              magic.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="icon-box-2">
            <i className="im im-icon-Money-2" />
            <h3>Get paid</h3>
            <p>Once the job is complete we will pay you.</p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h2 className="headline centered">
            <span className="margin-top-25">
              The best part, we are here for you to grow your business. Be part of the change!
            </span>
          </h2>
        </div>
      </div>
    </div>

    <div className="margin-top-80 margin-bottom-80">
      <div className="row vertical-align">
        <div className="col-lg-6 col-sm-6">
          <img src="images/placeholder-bg.jpg" alt="" />
        </div>
        <div className="col-lg-6 col-sm-6">
          <div className="centered-content">
            <h2 className="headline">Start your journey here</h2>
            <SecureLink
              className="button border"
              history={props.history}
              to="/join/application"
              onLoggedIn={() => {
                props.closeModal();
                props.history.push('/join/application');
              }}
            >
              Get Started
            </SecureLink>
          </div>
        </div>
      </div>
    </div>
  </div>
);

StylistsJoinPage.propTypes = {
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { closeModal })(StylistsJoinPage);
