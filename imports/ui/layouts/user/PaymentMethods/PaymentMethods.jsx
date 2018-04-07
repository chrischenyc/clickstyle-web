import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PaymentMethodsPage from './PaymentMethodsPage';
import { withLoading } from '../../../components/HOC';

class PaymentMethods extends Component {
  constructor(props) {
    super(props);

    this.state = {
      savedCards: [],
    };

    this.handleRemoveSavedCard = this.handleRemoveSavedCard.bind(this);
  }

  componentDidMount() {
    this.loadSavedCards();
  }

  loadSavedCards() {
    this.props.showLoading();

    Meteor.call('profiles.savedCards', (error, savedCards) => {
      this.props.hideLoading();
      if (!error) {
        this.setState({ savedCards });
      }
    });
  }

  handleRemoveSavedCard(id) {
    Meteor.call('profiles.remove.savedCard', id, (error) => {
      if (!error) {
        this.loadSavedCards();
      }
    });
  }

  render() {
    return (
      <PaymentMethodsPage
        savedCards={this.state.savedCards}
        removeSavedCard={this.handleRemoveSavedCard}
      />
    );
  }
}

PaymentMethods.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(PaymentMethods);
