import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Popup, Grid } from 'semantic-ui-react';
import _ from 'lodash';

import Services from '../../../../api/services/services';
import Addons from '../../../../api/addons/addons';
import SemanticGeoSuggest from '../../../components/SemanticGeoSuggest/SemanticGeoSuggest';
import ServicesList from './ServicesList';
import servicesKeywordMatch from '../../../../modules/services-keyword-match.js';

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
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleServiceInputKeyDown = this.handleServiceInputKeyDown.bind(this);
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
                  color={Meteor.settings.public.semantic.color}
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
            <SemanticGeoSuggest
              fluid
              size="large"
              placeholder="suburb, postcode"
              country="au"
              name="address.raw"
              onFocus={() => {
                this.setState({ isServicesListOpen: false });
              }}
              onChange={(value) => {
                // convert to generic onChange param
                // onChange({ target: { name: 'address.raw', value } });
              }}
              onSuggestSelect={(suggest) => {
                // force onChange as well
                // onChange({ target: { name: 'address.raw', value: suggest.label } });
                // onAddressSuggest(suggest);
              }}
              style={{ width: '100%' }}
            />
          </Grid.Column>

          <Grid.Column width="4" style={{ padding: '0 1px' }}>
            <Popup
              trigger={
                <Button
                  fluid
                  basic
                  size="large"
                  color={Meteor.settings.public.semantic.color}
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
              color={Meteor.settings.public.semantic.color}
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
