import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import SearchPage from './SearchPage';
import { ServiceNameToSEOName, SEONameToServiceName } from '../../../modules/seo-name';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service:
        (props.match.params.service && SEONameToServiceName(props.match.params.service)) || '',
      suburb: props.match.params.suburb || '',
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
      this.search(this.state.service, this.state.suburb);
    } else {
      // TODO: display empty page
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.match.params, nextProps.match.params)) {
      const { service, suburb } = nextProps.match.params;

      this.search(SEONameToServiceName(service), suburb);
    }
  }

  handleSearch(service) {
    this.props.history.push(`/stylists/${ServiceNameToSEOName(service)}`);
  }

  handleLoadMore() {
    this.search(this.state.service, this.state.suburb, this.state.stylists.length);
  }

  search(service, suburb, offset = 0) {
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

    Meteor.call('stylists.search', { service, suburb, offset }, (error, result) => {
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
    });
  }

  render() {
    return (
      <SearchPage
        onSearch={this.handleSearch}
        onLoadMore={this.handleLoadMore}
        service={this.state.service}
        suburb={this.state.suburb}
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
