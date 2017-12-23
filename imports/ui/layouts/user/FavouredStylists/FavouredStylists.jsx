import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import FavouredStylistsPage from './FavouredStylistsPage';

class FavouredStylists extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stylists: [],
    };

    this.handleUnFavourStylist = this.handleUnFavourStylist.bind(this);
  }

  componentDidMount() {
    this.loadStylists();
  }

  loadStylists() {
    Meteor.call('stylists.favoured', {}, (error, stylists) => {
      this.setState({ stylists });
    });
  }

  handleUnFavourStylist(owner) {
    Meteor.call(
      'stylists.favourite',
      {
        owner,
        favourite: false,
      },
      (error) => {
        if (!error) {
          this.loadStylists();
        }
      },
    );
  }

  render() {
    return (
      <FavouredStylistsPage
        stylists={this.state.stylists}
        unFavourStylist={this.handleUnFavourStylist}
      />
    );
  }
}

export default FavouredStylists;
