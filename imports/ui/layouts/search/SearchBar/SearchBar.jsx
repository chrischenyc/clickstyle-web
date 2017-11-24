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

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service: props.service || '',
      isServicesListOpen: false,
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleServiceInputKeyDown = this.handleServiceInputKeyDown.bind(this);
  }

  handleServiceChange(service) {
    this.setState({ service });
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
          <Grid.Column width="5" style={{ padding: '0 2px' }}>
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
                  services={services
                    .map(service => ({
                      ...service,
                      addons: addons.filter(addon => addon.serviceId === service._id),
                    }))
                    .filter((service) => {
                      if (!_.isEmpty(this.state.service)) {
                        if (
                          service.name.toLowerCase().indexOf(this.state.service.toLowerCase()) !==
                          -1
                        ) {
                          return true;
                        }

                        let addonMatched = false;
                        service.addons.forEach((addon) => {
                          if (
                            addon.name.toLowerCase().indexOf(this.state.service.toLowerCase()) !==
                            -1
                          ) {
                            addonMatched = true;
                          }
                        });

                        return addonMatched;
                      }
                      return true;
                    })}
                  onSelection={this.handleServiceSelection}
                />
              </Popup.Content>
            </Popup>
          </Grid.Column>

          <Grid.Column width="5" style={{ padding: '0 2px' }}>
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

          <Grid.Column width="3" style={{ padding: '0 2px' }}>
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

          <Grid.Column width="3" style={{ padding: '0 2px' }}>
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
