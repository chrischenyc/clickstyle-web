import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HomePage from './HomePage';
import Services from '../../../api/services/services';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stylists: [],
    };
  }

  componentDidMount() {
    Meteor.call('featured.home.stylists', {}, (error, stylists) => {
      if (error) {
        console.log('error', error);
      }

      if (stylists) {
        this.setState({ stylists });
      }
    });
  }

  render() {
    return <HomePage services={this.props.services} stylists={this.state.stylists} />;
  }
}

Home.defaultProps = {
  services: [],
};

Home.propTypes = {
  services: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('services');

  return {
    services: Services.find({}, { sort: { displayOrder: 1 } }).fetch(),
  };
})(Home);
