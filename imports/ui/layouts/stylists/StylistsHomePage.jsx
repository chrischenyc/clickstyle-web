import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Header, Button } from 'semantic-ui-react';

import { closeModal } from '../../../modules/client/redux/modal';
import SecureLink from '../../components/SecureLink';

const StylistsHomepage = props => (
  <Container style={{ padding: '8rem 0' }}>
    <Header as="h1">Are you a stylist? Join the squad!</Header>

    <p>
      By joining stylesquad, you wil Expedita ducimus exercitationem ratione occaecati optio maxime
      non. Non perferendis praesentium error et. Illum molestias quibusdam cumque eum neque.
      Voluptas corporis fugiat tempora vitae animi dicta velit. Libero dignissimos dolore
      consequatur in non nesciunt laborum. Laudantium modi ut optio pariatur necessitatibus sed
      ullam itaque deserunt. Molestiae saepe accusantium ratione ut sunt doloribus non libero. Velit
      explicabo eligendi possimus. Quia ab quibusdam. Nobis ducimus dolorem culpa deleniti commodi
      velit voluptates. Est quia voluptates optio impedit. Eum ut est ut eligendi sed quis. Sapiente
      dolor eius eos rem magni.
    </p>

    <Button
      content="Join the squad!"
      size="massive"
      color={Meteor.settings.public.semantic.color}
      icon="right arrow"
      labelPosition="right"
      as={SecureLink}
      to="/stylists/join"
      onLoggedIn={() => {
        props.closeModal();
        props.history.push('/stylists/join');
      }}
    />
  </Container>
);

StylistsHomepage.propTypes = {
  closeModal: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { closeModal })(StylistsHomepage);
