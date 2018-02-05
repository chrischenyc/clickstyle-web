import React, { Component } from 'react';
import queryString from 'query-string';

import ContactPage from './ContactPage';

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
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
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
      />
    );
  }
}

export default Contact;
