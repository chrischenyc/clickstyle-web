import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import SearchPage from './SearchPage';
import {
  ServiceNameToSEOName,
  SEONameToServiceName,
  SuburbNameToSEOName,
  SEONameToSuburbName,
} from '../../../modules/seo-name';

class Search extends Component {
  constructor(props) {
    super(props);

    const { service, suburb, postcode } = props.match.params;

    this.state = {
      service: (service && SEONameToServiceName(service)) || '',
      suburb: (suburb && `${SEONameToSuburbName(suburb)}`) || '',
      postcode,
      searching: false,
      searched: false,
      error: '',
      stylists: [],
      hasMore: false,
      foundNothing: false,
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.service) {
      this.search(this.state.service, this.state.suburb, this.state.postcode);
    } else {
      // TODO: display empty page
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.match.params, nextProps.match.params)) {
      const { service, suburb, postcode } = nextProps.match.params;

      if (service) {
        this.search(SEONameToServiceName(service), SEONameToSuburbName(suburb), postcode);
      }
    }
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
    if (!_.isNil(service)) {
      this.setState({ service });
      let searchUrl = `/stylists/${ServiceNameToSEOName(service)}`;

      if (!_.isNil(suburb)) {
        this.setState({ suburb });
        searchUrl += `/${SuburbNameToSEOName(suburb)}`;
      }

      if (!_.isNil(postcode)) {
        this.setState({ postcode });
        searchUrl += `/${postcode}`;
      }

      this.props.history.push(searchUrl);
    }
  }

  handleLoadMore() {
    this.search(
      this.state.service,
      this.state.suburb,
      this.state.postcode,
      this.state.stylists.length,
    );
  }

  search(service, suburb, postcode, offset = 0) {
    this.setState({
      searching: true,
      searched: false,
      error: '',
      hasMore: false,
      foundNothing: false,
    });

    // reset current records in case of new search
    if (offset === 0) {
      this.setState({ stylists: [] });
    }

    // TODO: GA tracking

    Meteor.call(
      'stylists.search',
      {
        service,
        suburb,
        postcode,
        offset,
      },
      (error, result) => {
        this.setState({ searching: false, searched: true });

        if (error) {
          this.setState({ error });
        } else if (result) {
          const { stylists, hasMore } = result;
          const newStylists = [...this.state.stylists, ...stylists];

          this.setState({
            stylists: newStylists,
            hasMore,
            foundNothing: newStylists.length === 0 && !hasMore,
          });
        }
      },
    );
  }

  render() {
    return (
      <SearchPage
        onSearch={this.handleSearch}
        onLoadMore={this.handleLoadMore}
        service={this.state.service}
        suburb={this.state.suburb}
        postcode={this.state.postcode}
        searching={this.state.searching}
        searched={this.state.searched}
        error={this.state.error}
        stylists={this.state.stylists}
        hasMore={this.state.hasMore}
        foundNothing={this.state.foundNothing}
      />
    );
  }
}

export default Search;
