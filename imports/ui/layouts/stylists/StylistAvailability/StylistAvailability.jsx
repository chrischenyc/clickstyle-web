import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Stylists from '../../../../api/stylists/stylists';
import { validateStylistServices } from '../../../../modules/validate';
import StylistAvailabilityPage from './StylistAvailabilityPage';

// platform-independent stateful container component
// to handle edit stylist opening hours
class StylistAvailability extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // selectedServices:
      //   props.stylist && props.stylist.services ? _.cloneDeep(props.stylist.services) : [],
      errors: {},
      saving: false,
      pristine: true,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // after Profile object is fetched, set it in state

    this.setState({
      pristine: true,
      // selectedServices:
      //   nextProps.stylist && nextProps.stylist.services
      //     ? _.cloneDeep(nextProps.stylist.services)
      //     : [],
    });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    /*
    const errors = validateStylistServices(this.state.selectedServices);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ saving: true });

      Meteor.call('stylists.update.services', this.state.selectedServices, (error) => {
        this.setState({ saving: false, errors: {}, pristine: true });

        if (error) {
          this.setState({ errors: { message: error.reason } });
        }
      });
    }

    */
  }

  render() {
    return (
      <StylistAvailabilityPage
        onSubmit={this.handleSubmit}
        loading={this.props.loading}
        saving={this.state.saving}
        pristine={this.state.pristine}
        errors={this.state.errors}
      />
    );
  }
}

StylistAvailability.defaultProps = {
  loading: false,
  stylist: null,
};

StylistAvailability.propTypes = {
  loading: PropTypes.bool,
  stylist: PropTypes.object,
};

export default withTracker(() => {
  const handleStylist = Meteor.subscribe('stylists.owner');

  return {
    loading: !handleStylist.ready(),
    stylist: Stylists.findOne(),
  };
})(StylistAvailability);
