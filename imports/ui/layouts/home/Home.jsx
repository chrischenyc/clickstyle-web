import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import HomePage from './HomePage';
import { ServiceNameToSEOName, SuburbNameToSEOName } from '../../../modules/seo-name';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: [],
      stylists: [],
      isStylistsLocationBased: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
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

  /**
   * Input can be passed from children component, i.e.: SearchBar.jsx
   * or from route url params, i.e.: /:service/:suburb?/:postcode?
   *
   * Depends on the available params, page wil be redirected to various search route
   *
   * @param {name of the service or addon, required} service
   * @param {name of the suburb, optional} suburb
   * @param {postcode, optional} postcode
   */
  handleSearch({ service, suburb, postcode }) {
    let searchUrl = '/stylists';

    if (!_.isNil(service)) {
      searchUrl += `/${ServiceNameToSEOName(service)}`;
    }

    if (!_.isNil(suburb)) {
      searchUrl += `/${SuburbNameToSEOName(suburb)}`;
    }

    if (!_.isNil(postcode)) {
      searchUrl += `/${postcode}`;
    }

    this.props.history.push(searchUrl);
  }

  render() {
    return (
      <HomePage
        services={this.state.services}
        stylists={this.state.stylists}
        authenticated={this.props.authenticated}
        isStylistsLocationBased={this.state.isStylistsLocationBased}
        onSearch={this.handleSearch}
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
