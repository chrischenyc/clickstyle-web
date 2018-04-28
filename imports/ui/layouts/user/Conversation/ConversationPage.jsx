import { Meteor } from 'meteor/meteor';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import PropTypes from 'prop-types';
import { Container, Grid, Button } from 'semantic-ui-react';
import ConversationBookingSummary from './ConversationBookingSummary';
import scaledImageURL from '../../../../modules/scaled-image-url';

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
                {props.messages.map(message => (
                  <div
                    key={message._id}
                    className={classNames('message-bubble', {
                      me: message.sender === props.userId,
                    })}
                  >
                    <div className="message-avatar">
                      <img
                        src={scaledImageURL(
                          (message.sender === props.userId
                            ? props.userPhoto
                            : props.booking.recipient.photo) ||
                            Meteor.settings.public.defaultAvatar,
                          'small',
                        )}
                        alt=""
                      />
                    </div>
                    <div className="message-text">
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))}

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

ConversationPage.defaultProps = {
  userId: null,
  userPhoto: null,
};

ConversationPage.propTypes = {
  booking: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  messages: PropTypes.array.isRequired,
  userId: PropTypes.string,
  userPhoto: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};

export default ConversationPage;
