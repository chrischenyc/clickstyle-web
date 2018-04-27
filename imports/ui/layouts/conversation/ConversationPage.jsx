import React from 'react';

import PropTypes from 'prop-types';
import { Container, Grid } from 'semantic-ui-react';
import ConversationBookingSummary from './ConversationBookingSummary';

const ConversationPage = props => (
  <Container>
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width="4">
          <ConversationBookingSummary booking={props.booking} />
        </Grid.Column>
        <Grid.Column width="12">chat</Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

ConversationPage.propTypes = {
  booking: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmitReview: PropTypes.func.isRequired,
};

export default ConversationPage;
