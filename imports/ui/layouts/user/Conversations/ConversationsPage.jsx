import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import moment from 'moment';
import classNames from 'classnames';

import scaledImageURL from '../../../../modules/scaled-image-url';

const ConversationsPage = ({ conversations }) => (
  <Container>
    <div className="row">
      <div className="col-lg-12 col-md-12">
        <div className="messages-container margin-top-0">
          <div className="messages-headline">
            <h4>Inbox</h4>
          </div>

          <div className="messages-inbox">
            <ul>
              {conversations.map(conversation => (
                <li key={conversation._id} className={classNames({ unread: !conversation.read })}>
                  <Link to={`/users/conversations/${conversation.booking}`}>
                    <div className="message-avatar" style={{ textAlign: 'center' }}>
                      <img
                        src={scaledImageURL(
                          conversation.recipient.photo || Meteor.settings.public.defaultAvatar,
                          'small',
                        )}
                        alt=""
                      />

                      <h5>
                        {`${conversation.recipient.name.first} ${conversation.recipient.name.last}`}
                      </h5>
                    </div>

                    <div className="message-by">
                      <div className="message-by-headline">
                        <h5>
                          {conversation.lastMessage.sender}{' '}
                          {!conversation.lastMessage.read && <i>Unread</i>}
                        </h5>
                        <span>{moment(conversation.lastMessage.createdAt).fromNow()}</span>
                      </div>
                      <p>{conversation.lastMessage.content}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Container>
);

ConversationsPage.propTypes = {
  conversations: PropTypes.array.isRequired,
};

export default ConversationsPage;
