import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';

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
          if (!this.state.booking.conversation) {
            // refresh page if the conversation didn't exist before this message was created
            window.location.reload();
          }
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
          userId={this.props.userId}
          userPhoto={this.props.userPhoto}
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
  userId: null,
  userPhoto: null,
};

Conversation.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
  messages: PropTypes.array,
  userId: PropTypes.string,
  userPhoto: PropTypes.string,
};

const mapStateToProps = state => ({
  userId: state.user.id,
  userPhoto: state.user.profile && state.user.profile.photo,
});

export default compose(
  withTracker((props) => {
    const { _id } = props.match.params;
    Meteor.subscribe('conversation.messages', _id);

    return {
      messages: Messages.find({}).fetch(),
    };
  }),
  connect(mapStateToProps),
)(withLoading(Conversation));
