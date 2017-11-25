import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Card, Image, Container, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { formatYear } from '../../../modules/format-date';
import ScaledImageURL from '../../../modules/scaled-image-url';
import SideMenuContainer from '../../components/SideMenuContainer';
import Loading from '../../components/Loading';
import { PrimaryColor } from '../../../modules/client/constants';

const ProfilePage = ({ profile }) => {
  if (!profile) {
    return (
      <SideMenuContainer>
        <Loading />
      </SideMenuContainer>
    );
  }

  const photoURL = profile.photo || Meteor.settings.public.image.defaultProfilePhoto;

  return (
    <SideMenuContainer>
      <Container>
        <Image src={ScaledImageURL(photoURL, 'small')} size="small" rounded centered />

        <Card fluid>
          <Card.Content textAlign="center">
            <Card.Header>{`${profile.name.first} ${profile.name.last}`}</Card.Header>
            <Card.Meta>
              <span className="date">Joined in {formatYear(profile.createdAt)}</span>
            </Card.Meta>
            <Card.Description>{profile.about}</Card.Description>
          </Card.Content>

          <Card.Content extra textAlign="center">
            <Card.Header as="h3">Products</Card.Header>
            {profile.products &&
              profile.products.map(product => (
                <Label
                  size="large"
                  key={product.name}
                  color={PrimaryColor}
                  basic
                  style={{ marginBottom: '0.25rem' }}
                >
                  {product.name}
                </Label>
              ))}
          </Card.Content>
        </Card>
      </Container>
    </SideMenuContainer>
  );
};

ProfilePage.defaultProps = {
  profile: null,
};

ProfilePage.propTypes = {
  profile: PropTypes.object,
};

export default ProfilePage;
