import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import moment from 'moment';

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
                <li key={conversation.owner} className="unread">
                  <Link to={`/users/conversations/${conversation.booking}`}>
                    <div className="message-avatar">
                      <img
                        src="http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&amp;s=70"
                        alt=""
                      />
                    </div>

                    <div className="message-by">
                      <div className="message-by-headline">
                        <h5>
                          {conversation.lastMessageSender} <i>Unread</i>
                        </h5>
                        <span>{moment(conversation.updatedAt).fromNow()}</span>
                      </div>
                      <p>{conversation.lastMessageExcerpt}</p>
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
