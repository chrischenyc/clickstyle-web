import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import SearchPage from './SearchPage';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service: props.match.params.service || '',
      suburb: props.match.params.suburb || '',
      searching: false,
      error: '',
      stylists: [],
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.match.params, nextProps.match.params)) {
      const { service, suburb } = nextProps.match.params;

      this.search(service, suburb);
    }
  }

  handleSearch(service) {
    this.props.history.push(`/stylists/${service}`);
  }

  search(service, suburb) {
    this.setState({ searching: true });

    Meteor.call('stylists.search', { service, suburb }, (error, stylists) => {
      this.setState({ searching: false });

      if (error) {
        this.setState({ error });
      }

      if (stylists) {
        this.setState({ stylists });
      } else {
        this.setState({ stylists: [] });
      }
    });
  }

  render() {
    return (
      <SearchPage
        onSearch={this.handleSearch}
        service={this.state.service}
        suburb={this.state.suburb}
        searching={this.state.searching}
        error={this.state.error}
        stylists={this.state.stylists}
      />
    );
  }
}

export default Search;
