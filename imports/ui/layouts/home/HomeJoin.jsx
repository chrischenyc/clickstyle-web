import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';

const HomeJoin = () => (
  <div className="main-join-container" style={{ backgroundImage: 'url(images/main-join-bg.jpg)' }}>
    <div className="text-content white-font">
      <div className="container">
        <div className="row">
          <div className="col-lg-offset-8 col-lg-4 col-sm-offset-6 col-sm-6">
            <h2>Expand your business with {Meteor.settings.public.appName}</h2>
            <Link to="/join" className="button margin-top-25">
              Find Out More
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeJoin;
