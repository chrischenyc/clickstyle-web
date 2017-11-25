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
      error: '',
      stylists: [],
      hasMore: false,
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
    this.search(this.state.service, this.state.suburb);
  }

  search(service, suburb) {
    this.setState({ searching: true });

    // TODO: GA tracking

    Meteor.call(
      'stylists.search',
      { service, suburb, offset: this.state.stylists.length },
      (error, result) => {
        this.setState({ searching: false });

        if (error) {
          this.setState({ error });
        } else if (result) {
          const { stylists, hasMore } = result;

          this.setState({ stylists: [...this.state.stylists, ...stylists], hasMore });
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
        searching={this.state.searching}
        error={this.state.error}
        stylists={this.state.stylists}
        hasMore={this.state.hasMore}
      />
    );
  }
}

export default Search;
