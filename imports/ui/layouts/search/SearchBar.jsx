import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Popup, Grid } from 'semantic-ui-react';

import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';
import SemanticGeoSuggest from '../../components/SemanticGeoSuggest/SemanticGeoSuggest';
import ServicesList from './ServicesList';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      service: '',
      isServicesListOpen: false,
    };

    this.handleServiceChange = this.handleServiceChange.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
  }

  handleServiceChange(service) {
    this.setState({ service });
  }

  handleServiceSelection(service) {
    this.setState({ service, isServicesListOpen: false });
  }

  render() {
    const {
      loading, services, addons, ...rest
    } = this.props;

    return (
      <Grid stackable stretched {...rest}>
        <Grid.Row>
          <Grid.Column width="5" style={{ padding: '0 2px' }}>
            <Popup
              trigger={
                <Input
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
                  services={services.map(service => ({
                    ...service,
                    addons: addons.filter(addon => addon.serviceId === service._id),
                  }))}
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
            <Button fluid color={Meteor.settings.public.semantic.color} size="large">
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
  services: PropTypes.array,
  addons: PropTypes.array,
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
