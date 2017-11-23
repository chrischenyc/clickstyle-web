import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Image, Header, Button, List, Label, Icon } from 'semantic-ui-react';

import ScaledImageURL from '../../../modules/scaled-image-url';

const StylistsListItem = ({ stylist }) => (
  <Card fluid>
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width="4" textAlign="center" verticalAlign="top">
          <div style={{ padding: '1rem 0' }}>
            <Image
              size="tiny"
              circular
              src={ScaledImageURL(
                stylist.profile.photo || Meteor.settings.public.image.defaultProfilePhoto,
                'small',
              )}
              style={{ margin: '0 auto' }}
            />

            <Header>{`${stylist.profile.name.first} ${stylist.profile.name.last}`}</Header>

            {stylist.profile.address.suburb && (
              <div style={{ marginBottom: '1rem' }}>
                <Icon name="marker" color={Meteor.settings.public.semantic.color} size="large" />
                {stylist.profile.address.suburb}
              </div>
            )}

            <Button color={Meteor.settings.public.semantic.color} content="Book Now" size="large" />
          </div>
        </Grid.Column>
        <Grid.Column width="12" verticalAlign="middle">
          <List>
            {stylist.services.map(service => (
              <List.Item key={service._id}>
                {`${service.name} from $${service.basePrice}`}
              </List.Item>
            ))}
          </List>

          {stylist.profile.products && (
            <div>
              Products used:&nbsp;
              {stylist.profile.products.map(product => (
                <Label basic color={Meteor.settings.public.semantic.color} key={product.productId}>
                  {product.name}
                </Label>
              ))}
            </div>
          )}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Card>
);

StylistsListItem.propTypes = {
  stylist: PropTypes.object.isRequired,
};

export default StylistsListItem;
