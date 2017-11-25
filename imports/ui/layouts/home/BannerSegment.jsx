import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment } from 'semantic-ui-react';

import { PrimaryColor } from '../../../modules/client/constants';

const BannerSegment = () => (
  <Segment
    inverted
    textAlign="center"
    style={{
      padding: '8rem 0',
      backgroundImage:
        'url("https://images.unsplash.com/photo-1500840216050-6ffa99d75160?dpr=1&auto=compress,format&fit=crop&w=1080&h=&q=50&cs=tinysrgb&crop=")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    }}
    vertical
  >
    <Container text>
      <Header
        as="h1"
        content={Meteor.settings.public.applicationName}
        inverted
        style={{
          fontSize: '4rem',
          fontWeight: 'thick',
          fontStyle: 'italic',
        }}
      />
      <Header
        as="h2"
        content="Professional Beauty Service"
        inverted
        style={{
          fontSize: '1.7rem',
          fontWeight: 'normal',
          marginBottom: 0,
        }}
      />
      <Header
        as="h2"
        content="any where you want"
        inverted
        style={{
          fontSize: '1.7rem',
          fontWeight: 'normal',
          marginTop: 0,
        }}
      />

      <Button size="huge" color={PrimaryColor} as={Link} to="/stylists">
        Book Now
      </Button>
    </Container>
  </Segment>
);

export default BannerSegment;
