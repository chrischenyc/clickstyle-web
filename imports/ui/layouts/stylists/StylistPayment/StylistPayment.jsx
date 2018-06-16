import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import _ from 'lodash';

import StylistPaymentPage from './StylistPaymentPage';

class StylistPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      errors: {},
      saving: false,
      pristine: true,
      accountName: '',
      bsb: '',
      accountNumber: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadStylistBankInfo();
  }

  loadStylistBankInfo() {
    this.setState({ loading: true });

    Meteor.call('stylists.bank-info', (error, bankInfo) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({
          errors: { submit: error.reason },
        });
      } else {
        this.setState({
          pristine: true,
          accountName: (bankInfo && bankInfo.accountName) || '',
          bsb: (bankInfo && bankInfo.bsb) || '',
          accountNumber: (bankInfo && bankInfo.accountNumber) || '',
        });
      }
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value, pristine: false });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    this.setState({ saving: true });

    const { accountName, bsb, accountNumber } = this.state;
    Meteor.call('stylists.bank-info.update', { accountName, bsb, accountNumber }, (error) => {
      this.setState({ saving: false, errors: {}, pristine: true });

      if (error) {
        this.setState({ errors: { submit: error.reason } });
      }

      this.loadStylistBankInfo();
    });
  }

  render() {
    return (
      <StylistPaymentPage
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        loading={this.state.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
        accountName={this.state.accountName}
        bsb={this.state.bsb}
        accountNumber={this.state.accountNumber}
      />
    );
  }
}

export default StylistPayment;
