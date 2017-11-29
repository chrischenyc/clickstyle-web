import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Popup, Grid, Search } from 'semantic-ui-react';
import _ from 'lodash';

import Services from '../../../../api/services/services';
import Addons from '../../../../api/addons/addons';
import ServicesList from './ServicesList';
import servicesKeywordMatch from '../../../../modules/services-keyword-match';
import { PrimaryColor } from '../../../../modules/client/constants';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      services: props.services.map(service => ({
        ...service,
        addons: props.addons.filter(addon => addon.serviceId === service._id),
      })),
      service: props.service || '',
      isServicesListOpen: false,
      searchingSuburbs: false,
      suburb: '',
      matchedSuburbs: [],
      selectedSuburb: null,
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleServiceInputKeyDown = this.handleServiceInputKeyDown.bind(this);
    this.handleSuburbChange = this.handleSuburbChange.bind(this);
    this.handleSelectSuburb = this.handleSelectSuburb.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      !_.isEqual(this.props.services, nextProps.services) ||
      !_.isEqual(this.props.addons, nextProps.addons)
    ) {
      this.setState({
        services: nextProps.services.map(service => ({
          ...service,
          addons: nextProps.addons.filter(addon => addon.serviceId === service._id),
        })),
      });
    }
  }

  handleServiceChange(service) {
    this.setState({
      service,
      isServicesListOpen: servicesKeywordMatch(this.state.services, service).length > 0,
    });
  }

  handleServiceSelection(service) {
    this.setState({ service, isServicesListOpen: false });
    this.props.onSearch(service);
  }

  handleServiceInputKeyDown(event) {
    if (event.which === 13 && !_.isEmpty(this.state.service)) {
      // 'Enter'
      this.setState({ isServicesListOpen: false });
      this.props.onSearch(this.state.service);
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

  render() {
    const {
      loading, services, addons, onSearch, searching, ...rest
    } = this.props;

    return (
      <Grid stackable stretched {...rest}>
        <Grid.Row>
          <Grid.Column width="5" style={{ padding: '0 1px' }}>
            <Popup
              trigger={
                <Input
                  name="service"
                  fluid
                  icon="search"
                  iconPosition="left"
                  color={PrimaryColor}
                  placeholder="haircut, make-up, spa"
                  size="large"
                  value={this.state.service}
                  onChange={(event) => {
                    this.handleServiceChange(event.target.value);
                  }}
                  onKeyDown={this.handleServiceInputKeyDown}
                />
              }
              position="bottom left"
              hoverable
              onOpen={() => {
                this.setState({ isServicesListOpen: true });
              }}
              onClose={() => {
                this.setState({ isServicesListOpen: false });
              }}
              open={this.state.isServicesListOpen}
              flowing
              style={{ width: '50rem', maxWidth: '90%' }}
            >
              <Popup.Content>
                <ServicesList
                  services={servicesKeywordMatch(this.state.services, this.state.service)}
                  onSelection={this.handleServiceSelection}
                />
              </Popup.Content>
            </Popup>
          </Grid.Column>

          <Grid.Column width="4" style={{ padding: '0 1px' }}>
            <Search
              input={<Input fluid size="large" />}
              name="suburb"
              placeholder="suburb, postcode"
              loading={this.state.searchingSuburbs}
              onFocus={() => {
                this.setState({ isServicesListOpen: false });
              }}
              onResultSelect={(e, { result }) => {
                this.handleSelectSuburb(result);
              }}
              onSearchChange={(e, data) => {
                this.handleSuburbChange(data);
              }}
              results={this.state.matchedSuburbs}
              showNoResults={false}
              value={this.state.suburb}
              style={{ borderRadius: '.28571429rem' }}
            />
          </Grid.Column>

          <Grid.Column width="4" style={{ padding: '0 1px' }}>
            <Popup
              trigger={
                <Button
                  fluid
                  basic
                  size="large"
                  color={PrimaryColor}
                  content="Any Date"
                  icon="calendar"
                />
              }
              content="TODO: display calendar"
              on="hover"
              position="bottom center"
            />
          </Grid.Column>

          <Grid.Column width="3" style={{ padding: '0 1px' }}>
            <Button
              fluid
              color={PrimaryColor}
              size="large"
              onClick={() => {
                onSearch(this.state.service);
              }}
              loading={searching}
            >
              Search
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
  service: PropTypes.string.isRequired,
  suburb: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
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
