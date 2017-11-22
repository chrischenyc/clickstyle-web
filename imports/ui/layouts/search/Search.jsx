import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import SearchPage from './SearchPage';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searching: false,
      error: '',
      stylists: [],
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(service) {
    this.setState({ searching: true });

    Meteor.call('stylists.search', { service }, (error, stylists) => {
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
        searching={this.state.searching}
        error={this.state.error}
        stylists={this.state.stylists}
      />
    );
  }
}

export default Search;
