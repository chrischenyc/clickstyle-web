import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    Meteor.call('featured.home.stylists', {}, (error, { stylists, locationBased }) => {
      if (error) {
        console.log('error', error);
      }

      if (stylists) {
        this.setState({ stylists, isStylistsLocationBased: locationBased });
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
  id: state.user.id,
});

export default connect(mapStateToProps)(Home);
