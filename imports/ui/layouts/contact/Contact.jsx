import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import queryString from 'query-string';
import _ from 'lodash';

import ContactPage from './ContactPage';
import { validateContactForm } from '../../../modules/validate';

class Contact extends Component {
  constructor(props) {
    super(props);

    const { suggestStylist: suggestStylistQuery } = queryString.parse(props.location.search);

    this.state = {
      name: '',
      email: '',
      phone: '',
      subject: suggestStylistQuery ? 'suggest stylist' : '',
      message: suggestStylistQuery ? 'I want to suggest a stylist ...' : '',
      suggestStylist: suggestStylistQuery || false,
      errors: {},
      loading: false,
      showSuccess: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseSuccess = this.handleCloseSuccess.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleCloseSuccess() {
    this.setState({
      showSuccess: false,
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  }

  handleSubmit() {
    const errors = validateContactForm(
      this.state.name,
      this.state.email,
      this.state.phone,
      this.state.subject,
      this.state.message,
    );

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });
      Meteor.call('userContacts.create', this.state, (error) => {
        this.setState({ loading: false });

        if (error) {
          this.setState({ errors: { form: error.reason } });
        } else {
          this.setState({ showSuccess: true });
        }
      });
    }
  }

  render() {
    return (
      <ContactPage
        suggestStylist={this.state.suggestStylist}
        name={this.state.name}
        email={this.state.email}
        phone={this.state.phone}
        subject={this.state.subject}
        message={this.state.message}
        onChange={this.handleChange}
        onSubmit={this.handleSubmit}
        loading={this.state.loading}
        errors={this.state.errors}
        showSuccess={this.state.showSuccess}
        closeSuccess={this.handleCloseSuccess}
      />
    );
  }
}

export default Contact;
