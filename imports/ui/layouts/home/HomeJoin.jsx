import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const HomeJoin = () => (
  <div className="main-join-container">
    <div className="text-content white-font">
      <div className="container">
        <div className="row">
          <div className="col-lg-offset-8 col-lg-4 col-sm-offset-6 col-sm-6">
            <h2>Expand your business with {Meteor.settings.public.appName}</h2>

            <Button circular size="massive" color="teal" as={Link} to="/join">
              Find Out More
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeJoin;
