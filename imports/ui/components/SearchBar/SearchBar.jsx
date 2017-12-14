import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';
import ServicesList from './ServicesList';
import servicesKeywordMatch from '../../../modules/services-keyword-match';

const aggregateServiceAddons = (services, addons) =>
  services.map(service => ({
    ...service,
    addons: addons.filter(addon => addon.serviceId === service._id),
  }));

const aggregateSuburbPostcode = (suburb, postcode) =>
  (suburb && suburb + (postcode ? ` ${postcode}` : '')) || '';

const suburbObject = (suburb, postcode) => (suburb && { name: suburb, postcode }) || null;

class SearchBar extends Component {
  constructor(props) {
    super(props);

    const {
      services, addons, service, suburb, postcode,
    } = props;

    this.state = {
      services: aggregateServiceAddons(services, addons),
      service,
      suburb,
      postcode,
      selectedSuburb: suburbObject(suburb, postcode),
      isServicesListOpen: false,
      searchingSuburbs: false,
      matchedSuburbs: [],
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleServiceInputKeyDown = this.handleServiceInputKeyDown.bind(this);
    this.handleSuburbChange = this.handleSuburbChange.bind(this);
    this.handleSelectSuburb = this.handleSelectSuburb.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {
      services, addons, service, suburb, postcode,
    } = nextProps;

    this.setState({
      services: aggregateServiceAddons(services, addons),
      service,
      suburb,
      postcode,
      selectedSuburb: suburbObject(suburb, postcode),
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
      loading, searching, services, addons, onSearch,
    } = this.props;

    const { service, suburb, postcode } = this.state;

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

        <button
          className="button"
          disabled={searching}
          onClick={() => {
            onSearch(service, suburb, postcode);
          }}
        >
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
  service: '',
  suburb: '',
  postcode: '',
};

SearchBar.propTypes = {
  loading: PropTypes.bool,
  searching: PropTypes.bool,
  services: PropTypes.array,
  addons: PropTypes.array,
  service: PropTypes.string,
  suburb: PropTypes.string,
  postcode: PropTypes.string,
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
