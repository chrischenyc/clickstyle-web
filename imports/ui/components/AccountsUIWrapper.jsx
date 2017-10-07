import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import React, { Component } from 'react';

class AccountsUIWrapper extends Component {
  componentDidMount() {
    this.view = Blaze.render(Template.loginButtons, this.container);
  }
  componentWillUnmount() {
    Blaze.remove(this.view);
  }
  render() {
    return (
      <span
        ref={(node) => {
          this.container = node;
        }}
      />
    );
  }
}

export default AccountsUIWrapper;
