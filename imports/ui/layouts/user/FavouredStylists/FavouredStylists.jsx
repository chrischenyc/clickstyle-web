import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FavouredStylistsPage from './FavouredStylistsPage';
import { withLoading } from '../../../components/HOC';

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
    this.props.showLoading();

    Meteor.call('stylists.favoured', {}, (error, stylists) => {
      this.props.hideLoading();
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

FavouredStylists.propTypes = {
  showLoading: PropTypes.func.isRequired,
  hideLoading: PropTypes.func.isRequired,
};

export default withLoading(FavouredStylists);
