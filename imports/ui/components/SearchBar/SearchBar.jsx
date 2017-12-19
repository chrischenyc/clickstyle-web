import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';
import ServicesList from './ServicesList';
import servicesKeywordMatch from '../../../modules/services-keyword-match';
import {
  ServiceNameToSEOName,
  SEONameToServiceName,
  SuburbNameToSEOName,
  SEONameToSuburbName,
} from '../../../modules/seo-name';

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

    const { services, addons } = props;
    const { service, suburb, postcode } = props.match.params;

    this.state = {
      services: aggregateServiceAddons(services, addons),
      service: (service && SEONameToServiceName(service)) || '',
      suburb: (suburb && `${SEONameToSuburbName(suburb)}`) || '',
      postcode: postcode || '',
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
    const { services, addons } = nextProps;

    const { service, suburb, postcode } = nextProps.match.params;

    this.setState({
      services: aggregateServiceAddons(services, addons),
      service: (service && SEONameToServiceName(service)) || '',
      suburb: (suburb && `${SEONameToSuburbName(suburb)}`) || '',
      postcode: postcode || '',
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

    this.redirectToSearch(
      service,
      selectedSuburb && selectedSuburb.name,
      selectedSuburb && selectedSuburb.postcode,
    );
  }

  /**
   * Input can be passed from children component, i.e.: SearchBar.jsx
   * or from route url params, i.e.: /:service/:suburb?/:postcode?
   *
   * Depends on the available params, page wil be redirected to various search route
   *
   * @param {name of the service or addon, required} service
   * @param {name of the suburb, optional} suburb
   * @param {postcode, optional} postcode
   */
  redirectToSearch(service, suburb, postcode) {
    let searchUrl = '/stylists';

    if (!_.isNil(service) && service.length > 0) {
      searchUrl += `/${ServiceNameToSEOName(service)}`;
    }

    if (!_.isNil(suburb) && suburb.length > 0) {
      searchUrl += `/${SuburbNameToSEOName(suburb)}`;
    }

    if (!_.isNil(postcode) && postcode.length > 0) {
      searchUrl += `/${postcode}`;
    }

    this.props.history.push(searchUrl);
  }

  render() {
    const {
      loading, services, addons, history,
    } = this.props;

    const { service, suburb, postcode } = this.state;

    return (
      <div className="main-search-input">
        <div className="main-search-input-item">
          <input type="text" placeholder="Service e.g Makeup" value={service} />
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
          onClick={() => {
            this.handleSearch();
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
  services: [],
  addons: [],
};

SearchBar.propTypes = {
  loading: PropTypes.bool,
  services: PropTypes.array,
  addons: PropTypes.array,
};

// TODO: replace subscription with method
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
})(withRouter(SearchBar));
