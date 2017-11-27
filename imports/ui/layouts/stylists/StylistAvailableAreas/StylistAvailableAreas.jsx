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
      errors: {},
      saving: false,
      pristine: true,
      radius: null,
      searchingSuburbs: false,
      matchedSuburbs: [],
      suburb: '',
      selectedSuburb: null,
      canTravel: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelectSuburb = this.handleSelectSuburb.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state

    this.setState({
      pristine: true,
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });

    if (event.target.name === 'suburb') {
      if (_.isEmpty(event.target.value)) {
        this.setState({ searchingSuburbs: false, matchedSuburbs: [] });
      } else if (event.target.value.length >= 2) {
        this.setState({ searchingSuburbs: true });
        Meteor.call('suburbs.search.all', event.target.value, (error, suburbs) => {
          this.setState({ searchingSuburbs: false });
          if (error) {
            this.setState({ error: error.reason });
          } else {
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
    this.setState({ selectedSuburb, suburb: `${selectedSuburb.name} ${selectedSuburb.postcode}` });
  }

  handleSubmit(event) {
    // this.setState({ errors: {} });
    // event.preventDefault();
    // const errors = validateStylistOpenHours(this.state.openHours);
    // if (!_.isEmpty(errors)) {
    //   this.setState({ errors });
    // } else {
    //   this.setState({ saving: true });
    //   Meteor.call('stylists.update.openHours', this.state.openHours, (error) => {
    //     this.setState({ saving: false, errors: {}, pristine: true });
    //     if (error) {
    //       this.setState({ errors: { message: error.reason } });
    //     }
    //   });
    // }
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
        errors={this.state.errors}
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
  stylist: null,
};

StylistAvailableAreas.propTypes = {
  loading: PropTypes.bool,
  stylist: PropTypes.object,
};

export default withTracker(() => {
  const handleStylist = Meteor.subscribe('stylists.owner');

  return {
    loading: !handleStylist.ready(),
    stylist: Stylists.findOne(),
  };
})(StylistAvailableAreas);
