import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withLoading } from '../../components/HOC';
import SearchPage from './SearchPage';
import parseSearchUrlParams from '../../../modules/client/parse-search-url';
import { DEFAULT_DURATION } from '../../../modules/constants';

class Search extends Component {
  constructor(props) {
    super(props);

    const {
      service, suburb, postcode, date, time, duration,
    } = parseSearchUrlParams(props);

    this.state = {
      service: service || '', // value of service input
      suburb: suburb || '', // value of suburb input
      postcode: postcode || '',
      date: date || '',
      time: time || '',
      duration: duration || DEFAULT_DURATION,
      searching: false,
      searched: false,
      error: '',
      stylists: [],
      hasMore: false,
      foundNothing: false,
    };

    this.handleLoadMore = this.handleLoadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.service) {
      this.search(
        this.state.service,
        this.state.suburb,
        this.state.postcode,
        this.state.date,
        this.state.time,
        this.state.duration,
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      service, suburb, postcode, date, time, duration,
    } = parseSearchUrlParams(nextProps);

    if (service) {
      this.search(service, suburb, postcode, date, time, duration);
    }
  }

  handleLoadMore() {
    this.search(
      this.state.service,
      this.state.suburb,
      this.state.postcode,
      this.state.date,
      this.state.time,
      this.state.duration,
      this.state.stylists.length,
    );
  }

  search(service, suburb, postcode, date, time, duration, offset = 0) {
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

    this.props.showLoading();

    Meteor.call(
      'stylists.search',
      {
        service,
        suburb,
        postcode,
        date,
        time,
        duration,
        offset,
      },
      (error, result) => {
        this.props.hideLoading();
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
        onLoadMore={this.handleLoadMore}
        searching={this.state.searching}
        searched={this.state.searched}
        error={this.state.error}
        stylists={this.state.stylists}
        hasMore={this.state.hasMore}
        foundNothing={this.state.foundNothing}
        service={this.state.service}
        suburb={this.state.suburb}
        postcode={this.state.postcode}
      />
    );
  }
}

Search.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(Search);
