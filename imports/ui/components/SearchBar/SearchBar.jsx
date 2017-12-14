import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';
import ServicesList from './ServicesList';
import servicesKeywordMatch from '../../../modules/services-keyword-match';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    const {
      services, addons, suburb, postcode,
    } = props;

    this.state = {
      services: services.map(service => ({
        ...service,
        addons: addons.filter(addon => addon.serviceId === service._id),
      })),
      service: props.service || '',
      isServicesListOpen: false,
      searchingSuburbs: false,
      suburb: (suburb && suburb + (postcode ? ` ${postcode}` : '')) || '',
      matchedSuburbs: [],
      selectedSuburb: (suburb && { name: suburb, postcode }) || null,
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleServiceInputKeyDown = this.handleServiceInputKeyDown.bind(this);
    this.handleSuburbChange = this.handleSuburbChange.bind(this);
    this.handleSelectSuburb = this.handleSelectSuburb.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { suburb, postcode } = nextProps;

    this.setState({
      services: nextProps.services.map(service => ({
        ...service,
        addons: nextProps.addons.filter(addon => addon.serviceId === service._id),
      })),
      service: nextProps.service || '',
      suburb: (suburb && suburb + (postcode ? ` ${postcode}` : '')) || '',
      selectedSuburb: (suburb && { name: suburb, postcode }) || null,
    });
  }

  handleServiceChange(service) {
    this.setState({
      service,
      isServicesListOpen: servicesKeywordMatch(this.state.services, service).length > 0,
    });
  }

  handleServiceSelection(service) {
    this.setState({ service, isServicesListOpen: false });
  }

  handleServiceInputKeyDown(event) {
    if (event.which === 13 && !_.isEmpty(this.state.service)) {
      // 'Enter'
      this.setState({ isServicesListOpen: false });
    }
  }

  handleSuburbChange(data) {
    // once user starts changing the search keyword
    // we empty current selected suburb object
    this.setState({ suburb: data.value, selectedSuburb: null });

    if (_.isEmpty(data.value)) {
      this.setState({ searchingSuburbs: false, matchedSuburbs: [] });
    } else if (data.value.length >= 2) {
      this.setState({ searchingSuburbs: true });
      Meteor.call('suburbs.search.published', data.value, (error, suburbs) => {
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

  handleSelectSuburb(selectedSuburb) {
    this.setState({
      selectedSuburb,
      suburb: `${selectedSuburb.name} ${selectedSuburb.postcode}`,
    });
  }

  handleSearch() {
    const { service, selectedSuburb } = this.state;

    if (_.isEmpty(service)) {
      // TODO: ask user to select a service
    } else {
      this.props.onSearch({
        service,
        suburb: selectedSuburb && selectedSuburb.name,
        postcode: selectedSuburb && selectedSuburb.postcode,
      });
    }
  }

  render() {
    const {
      loading, services, addons, onSearch, searching,
    } = this.props;

    return (
      <div className="main-search-input">
        <div className="main-search-input-item">
          <input type="text" placeholder="Service e.g Makeup" value="" />
        </div>

        <div className="main-search-input-item location">
          <input type="text" placeholder="Suburb" value="" />
          <a href="#">
            <i className="fa fa-dot-circle-o" />
          </a>
        </div>

        <div className="main-search-input-item location">
          <input type="text" placeholder="Any date" data-option="value" id="date-picker" />

          <a href="#">
            <i className="fa fa-calendar" />
          </a>
        </div>

        <div className="main-search-input-item location">
          <input type="text" placeholder="Any time" data-option="value" id="date-picker" />

          <a href="#">
            <i className="fa fa-clock-o" />
          </a>
        </div>

        <button className="button" onClick={onSearch}>
          Search
        </button>
      </div>
    );
  }
}

SearchBar.defaultProps = {
  loading: false,
  searching: false,
  services: [],
  addons: [],
};

SearchBar.propTypes = {
  loading: PropTypes.bool,
  service: PropTypes.string.isRequired,
  suburb: PropTypes.string.isRequired,
  postcode: PropTypes.string.isRequired,
  searching: PropTypes.bool,
  services: PropTypes.array,
  addons: PropTypes.array,
  onSearch: PropTypes.func.isRequired,
};

export default withTracker(() => {
  const handleServices = Meteor.subscribe('services');
  const handleAddons = Meteor.subscribe('addons.system.name');

  return {
    loading: !handleServices.ready() || !handleAddons.ready(),
    services: Services.find(
      {},
      {
        sort: { displayOrder: 1 },
      },
    ).fetch(),
    addons: Addons.find().fetch(),
  };
})(SearchBar);
