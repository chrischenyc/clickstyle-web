import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';

const HomeJoin = () => (
  <div
    className="parallax"
    data-background="images/slider-bg-02.jpg"
    data-color="#36383e"
    data-color-opacity="0.6"
    data-img-width="800"
    data-img-height="505"
  >
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
