import React from 'react';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { Container, Grid, Button } from 'semantic-ui-react';
import ConversationBookingSummary from './ConversationBookingSummary';

const ConversationPage = props => (
  <Container>
    <Grid stackable>
      <Grid.Row>
        <Grid.Column width="5">
          <ConversationBookingSummary booking={props.booking} />
        </Grid.Column>
        <Grid.Column width="11">
          <div className="messages-container">
            <div className="messages-container-inner">
              <div className="message-content">
                <div className="message-bubble">
                  <div className="message-avatar">
                    <img
                      src="http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70"
                      alt=""
                    />
                  </div>
                  <div className="message-text">
                    <p>
                      Hello, I want to talk about your great listing! Morbi velit eros, sagittis in
                      facilisis non, rhoncus et erat. Nam posuere tristique sem, eu ultricies tortor
                      lacinia neque imperdiet vitae.
                    </p>
                  </div>
                </div>

                <div className="message-bubble me">
                  <div className="message-avatar">
                    <img src="images/dashboard-avatar.jpg" alt="" />
                  </div>
                  <div className="message-text">
                    <p>
                      Nam ut hendrerit orci, ac gravida orci. Cras tristique rutrum libero at
                      consequat. Vestibulum vehicula neque maximus sapien iaculis, nec vehicula
                      sapien fringilla.
                    </p>
                  </div>
                </div>

                <div className="clearfix" />
                <div className="message-reply">
                  <textarea
                    cols="40"
                    rows="3"
                    placeholder="Your Message"
                    maxLength="1000"
                    style={{ marginBottom: '1em' }}
                    name="content"
                    onChange={props.onChange}
                    value={props.content}
                  />
                  <Button
                    color="teal"
                    loading={props.loading}
                    onClick={props.onSend}
                    disabled={_.isEmpty(props.content)}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

ConversationPage.propTypes = {
  booking: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default ConversationPage;
