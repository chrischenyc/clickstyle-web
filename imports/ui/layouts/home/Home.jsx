import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HomePage from './HomePage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      stylists: [],
    };
  }

  componentDidMount() {
    Meteor.call('featured.home.stylists', {}, (error, stylists) => {
      if (error) {
        console.log('error', error);
      }

      if (stylists) {
        this.setState({ stylists });
      }
    });

    Meteor.call('featured.home.services', {}, (error, services) => {
      if (error) {
        console.log('error', error);
      }

      if (services) {
        this.setState({ services });
      }
    });
  }

  render() {
    return <HomePage services={this.state.services} stylists={this.state.stylists} />;
  }
}

Home.defaultProps = {};

Home.propTypes = {};

export default Home;
