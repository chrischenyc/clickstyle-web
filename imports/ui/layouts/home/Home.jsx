import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import HomePage from './HomePage';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      stylists: [],
      isStylistsLocationBased: false,
    };
  }

  componentDidMount() {
    this.loadStylists();

    this.loadServices();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticated !== this.props.authenticated) {
      this.loadStylists();
    }
  }

  loadServices() {
    Meteor.call('featured.home.services', {}, (error, services) => {
      if (error) {
        console.log('error', error);
      }

      if (services) {
        this.setState({ services });
      }
    });
  }

  loadStylists() {
    Meteor.call('featured.home.stylists', {}, (error, { stylists, locationBased }) => {
      if (error) {
        console.log('error', error);
      }

      if (stylists) {
        this.setState({ stylists, isStylistsLocationBased: locationBased });
      }
    });
  }

  render() {
    return (
      <HomePage
        services={this.state.services}
        stylists={this.state.stylists}
        authenticated={this.props.authenticated}
        isStylistsLocationBased={this.state.isStylistsLocationBased}
      />
    );
  }
}

Home.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Home);
