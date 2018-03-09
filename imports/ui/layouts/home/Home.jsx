import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import HomePage from './HomePage';
import { withLoading } from '../../components/HOC';

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
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.authenticated !== this.props.authenticated) {
      this.loadData();
    }
  }

  loadData() {
    this.props.showLoading();

    Promise.all([
      new Promise((resolve, reject) => {
        // TODO: get user geo location from browser, pass the suburb as method parameter
        Meteor.call('featured.home.services', {}, (error, services) => {
          if (error) {
            reject(error);
          } else {
            this.setState({ services });
            resolve();
          }
        });
      }),
      new Promise((resolve, reject) => {
        // TODO: get user geo location from browser, pass the suburb as method parameter
        Meteor.call('featured.home.stylists', {}, (error, { stylists, locationBased }) => {
          if (error) {
            reject(error);
          } else {
            this.setState({ stylists, isStylistsLocationBased: locationBased });
            resolve();
          }
        });
      }),
    ]).then(() => {
      this.props.hideLoading();
    });
  }

  render() {
    return (
      <HomePage
        services={this.state.services}
        stylists={this.state.stylists}
        isStylistsLocationBased={this.state.isStylistsLocationBased}
      />
    );
  }
}

Home.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});

export default withLoading(connect(mapStateToProps)(Home));
