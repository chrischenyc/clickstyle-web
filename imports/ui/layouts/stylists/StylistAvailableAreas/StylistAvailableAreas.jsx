import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import StylistAvailableAreasPage from './StylistAvailableAreasPage';

// platform-independent stateful container component
// to handle edit stylist servicing areas
class StylistAvailableAreas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      error: '',
      saving: false,
      pristine: true,
      searchingSuburbs: false,
      matchedSuburbs: [],
      suburb: '',
      selectedSuburb: null,
      radius: 0,
      canTravel: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectSuburb = this.handleSelectSuburb.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadStylistAreas = this.loadStylistAreas.bind(this);
  }

  componentDidMount() {
    this.loadStylistAreas();
  }

  loadStylistAreas() {
    this.setState({ loading: true });

    Meteor.call('stylists.areas', (error, areas) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({
          error: error.reason,
        });
      } else {
        this.setState({
          pristine: true,
          suburb: (areas && areas.suburb && `${areas.suburb.name} ${areas.suburb.postcode}`) || '',
          selectedSuburb: (areas && areas.suburb) || null,
          radius: (areas && areas.radius) || 0,
          canTravel: (areas && areas.canTravel) || false,
        });
      }
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, pristine: false });

    if (event.target.name === 'suburb') {
      // once user starts changing the search keyword
      // we empty current selected suburb object
      this.setState({ selectedSuburb: null });

      if (_.isEmpty(event.target.value)) {
        this.setState({ searchingSuburbs: false, matchedSuburbs: [] });
      } else if (event.target.value.length >= 2) {
        this.setState({ searchingSuburbs: true });
        Meteor.call('suburbs.search.all', event.target.value, (error, suburbs) => {
          this.setState({ searchingSuburbs: false });
          if (!error) {
            this.setState({
              matchedSuburbs: suburbs.map(suburb => ({
                ...suburb,
                title: `${suburb.name} ${suburb.postcode}`,
              })),
            });
          }
        });
      }
    }
  }

  handleSelectSuburb(selectedSuburb) {
    this.setState({
      pristine: false,
      selectedSuburb,
      suburb: `${selectedSuburb.name} ${selectedSuburb.postcode}`,
    });
  }

  handleSubmit(event) {
    this.setState({ error: '' });
    event.preventDefault();

    if (!this.state.selectedSuburb) {
      this.setState({ error: 'please select a suburb' });
    } else {
      const { _id, name, postcode } = this.state.selectedSuburb;
      const areas = {
        suburb: { _id, name, postcode },
        radius: this.state.radius,
        canTravel: this.state.canTravel,
      };

      this.setState({ saving: true });
      Meteor.call('stylists.areas.update', areas, (error) => {
        this.setState({ saving: false, error: '', pristine: true });

        if (error) {
          this.setState({ error: error.reason });
        }

        this.loadStylistAreas();
      });
    }
  }

  render() {
    return (
      <StylistAvailableAreasPage
        radius={this.state.radius}
        onChange={this.handleChange}
        onSelectSuburb={this.handleSelectSuburb}
        onSubmit={this.handleSubmit}
        loading={this.state.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        error={this.state.error}
        searchingSuburbs={this.state.searchingSuburbs}
        matchedSuburbs={this.state.matchedSuburbs}
        suburb={this.state.suburb}
        canTravel={this.state.canTravel}
      />
    );
  }
}

export default StylistAvailableAreas;
