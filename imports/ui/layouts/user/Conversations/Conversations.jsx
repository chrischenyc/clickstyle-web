import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ConversationsPage from './ConversationsPage';
import { withLoading } from '../../../components/HOC';

class Conversations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversations: [],
    };
  }

  componentDidMount() {
    this.loadConversations();
  }

  loadConversations() {
    this.props.showLoading();

    Meteor.call('conversations.list', (error, conversations) => {
      this.props.hideLoading();
      this.setState({ conversations });
    });
  }

  render() {
    return <ConversationsPage conversations={this.state.conversations} />;
  }
}

Conversations.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(Conversations);
