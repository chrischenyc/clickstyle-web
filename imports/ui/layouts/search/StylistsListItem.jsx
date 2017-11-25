import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Card,
  Grid,
  Image,
  Header,
  Button,
  List,
  Label,
  Icon,
  Divider,
  Popup,
} from 'semantic-ui-react';
import _ from 'lodash';

import ScaledImageURL from '../../../modules/scaled-image-url';
import { PrimaryColor } from '../../../modules/client/constants';

const dummyBanners = [
  'http://res.cloudinary.com/stylesquard/image/upload/v1511498808/banner1_wahqwj',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511498807/banner2_nzwd8s',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511499198/banner4_e0qb2e',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511499199/banner3_wzdcon',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511499198/banner5_u7lgpc',
];

const StylistsListItem = ({ stylist }) => (
  <Card fluid as={Link} to={`/stylists/${stylist._id}`} style={{ color: '#212121' }}>
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
                <Icon name="marker" color={PrimaryColor} />
                {`${stylist.profile.address.suburb} ${stylist.profile.address.state}`}
              </div>
            )}

            <Divider style={{ margin: '0 4rem' }} />
            <List>
              {stylist.services.map(service => (
                <List.Item key={service._id}>
                  {`${service.name} from $${service.basePrice}`}&nbsp;
                  {service.addons.length > 0 && (
                    <Popup
                      flowing
                      position="top center"
                      trigger={<Icon name="tags" color={PrimaryColor} />}
                    >
                      <Popup.Content>
                        <List>
                          <List.Header>{`base price: $${service.basePrice}`}</List.Header>
                          <List.Header>add-ons:</List.Header>
                          {service.addons.map(addon => (
                            <List.Item key={addon._id}>
                              {`${addon.name} - $${addon.price}`}
                            </List.Item>
                          ))}
                        </List>
                      </Popup.Content>
                    </Popup>
                  )}
                </List.Item>
              ))}
            </List>

            <Button color={PrimaryColor} content="Book Now" size="large" />
          </div>
        </Grid.Column>
        <Grid.Column width="12" verticalAlign="top">
          <div style={{ padding: '0 0 1rem 0' }}>
            <Image src={_.sample(dummyBanners)} fluid />

            {stylist.profile.products && (
              <div>
                <Divider horizontal style={{ padding: '0 2rem' }}>
                  Products used
                </Divider>
                {stylist.profile.products.map(product => (
                  <Label
                    basic
                    color={PrimaryColor}
                    key={product.productId}
                    style={{ marginBottom: '0.25rem' }}
                  >
                    {product.name}
                  </Label>
                ))}
              </div>
            )}
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Card>
);

StylistsListItem.propTypes = {
  stylist: PropTypes.object.isRequired,
};

export default StylistsListItem;
