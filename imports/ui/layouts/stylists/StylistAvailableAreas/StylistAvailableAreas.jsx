import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Stylists from '../../../../api/stylists/stylists';
import StylistAvailableAreasPage from './StylistAvailableAreasPage';

// platform-independent stateful container component
// to handle edit stylist servicing areas
class StylistAvailableAreas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      saving: false,
      pristine: true,
      searchingSuburbs: false,
      matchedSuburbs: [],
      suburb:
        (props.areas &&
          props.areas.suburb &&
          `${props.areas.suburb.name} ${props.areas.suburb.postcode}`) ||
        '',
      selectedSuburb: (props.areas && props.areas.suburb) || null,
      radius: (props.areas && props.areas.radius) || 0,
      canTravel: (props.areas && props.areas.canTravel) || false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectSuburb = this.handleSelectSuburb.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state

    this.setState({
      pristine: true,
      suburb:
        (nextProps.areas &&
          nextProps.areas.suburb &&
          `${nextProps.areas.suburb.name} ${nextProps.areas.suburb.postcode}`) ||
        '',
      selectedSuburb: (nextProps.areas && nextProps.areas.suburb) || null,
      radius: (nextProps.areas && nextProps.areas.radius) || 0,
      canTravel: (nextProps.areas && nextProps.areas.canTravel) || false,
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
      Meteor.call('stylists.update.areas', areas, (error) => {
        this.setState({ saving: false, error: '', pristine: true });

        if (error) {
          this.setState({ error: error.reason });
        }
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
        loading={this.props.loading}
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

StylistAvailableAreas.defaultProps = {
  loading: false,
  areas: null,
};

StylistAvailableAreas.propTypes = {
  loading: PropTypes.bool,
  areas: PropTypes.object,
};

export default withTracker(() => {
  const handleStylist = Meteor.subscribe('stylists.owner');

  return {
    loading: !handleStylist.ready(),
    areas: Stylists.findOne() && Stylists.findOne().areas,
  };
})(StylistAvailableAreas);
