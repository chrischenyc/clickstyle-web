import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { withLoading } from '../../../components/HOC';
import ConversationPage from './ConversationPage';
import Messages from '../../../../api/messages/messages';

class Conversation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      booking: null,
      loading: false,
      error: '',
      content: '',
    };

    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    this.loadBooking();
  }

  loadBooking() {
    const { _id } = this.props.match.params;

    if (_.isNil(_id)) {
      this.props.history.push('/users/inbox');
      return;
    }

    this.props.showLoading();

    Meteor.call('bookings.conversationSummary', _id, (error, booking) => {
      this.props.hideLoading();

      if (booking) {
        this.setState({ booking });
      } else {
        this.props.history.push('/404');
      }
    });
  }

  handleOnChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSend() {
    this.setState({ loading: true });

    Meteor.call(
      'messages.create',
      {
        booking: this.state.booking._id,
        content: this.state.content,
      },
      (error) => {
        this.setState({ loading: false });

        if (error) {
          this.setState({ error: error.error });
        } else {
          this.setState({ error: '', content: '' });
        }
      },
    );
  }

  render() {
    if (!_.isNil(this.state.booking)) {
      return (
        <ConversationPage
          booking={this.state.booking}
          messages={this.props.messages}
          content={this.state.content}
          loading={this.state.loading}
          error={this.state.error}
          onChange={this.handleOnChange}
          onSend={this.handleSend}
        />
      );
    }
    return '';
  }
}

Conversation.defaultProps = {
  messages: [],
};

Conversation.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  messages: PropTypes.array,
};

export default withTracker((props) => {
  const { _id } = props.match.params;
  const handle = Meteor.subscribe('conversation.messages', _id);

  return {
    messages: Messages.find({}).fetch(),
  };
})(withLoading(Conversation));
