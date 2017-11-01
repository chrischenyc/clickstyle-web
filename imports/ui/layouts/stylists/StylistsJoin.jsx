import { withTracker } from "meteor/react-meteor-data";
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";

import Services from "../../../api/services/services";
import StylistsJoinPage from "./StylistsJoinPage";
import { validateStylistJoin } from "../../../modules/validate";

class StylistJoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: "",
      address: "",
      services: [],
      file: null,
      url: "",
      errors: {},
      submitting: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleServiceSelected = this.handleServiceSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mobile: nextProps.mobile,
      address: nextProps.address,
      services: nextProps.services.map(service => {
        return { ...service, checked: false };
      })
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleServiceSelected(selectedService, selected) {
    this.setState({
      services: this.state.services.map(service => {
        if (service === selectedService) {
          return {
            ...service,
            checked: selected
          };
        } else {
          return service;
        }
      })
    });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const { mobile, address, services, url } = this.state;
    const selectedServices = services.filter(service => {
      return service.checked;
    });

    const errors = validateStylistJoin(mobile, address, selectedServices, url);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ submitting: true });
    }
  }

  render() {
    return (
      <StylistsJoinPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onServiceSelected={this.handleServiceSelected}
        loading={this.props.loading || this.state.submitting}
        errors={this.state.errors}
        mobile={this.state.mobile}
        address={this.state.address}
        services={this.state.services}
        file={this.state.file}
        url={this.state.url}
      />
    );
  }
}

StylistJoin.defaultProps = {
  loading: true,
  services: []
};

StylistJoin.propTypes = {
  loading: PropTypes.bool,
  mobile: PropTypes.string,
  address: PropTypes.string,
  services: PropTypes.array
};

const mapStateToProps = state => {
  return {
    mobile: state.profile.mobile,
    address: state.profile.address && state.profile.address.raw
  };
};

export default compose(
  connect(mapStateToProps),
  withTracker(() => {
    const handle = Meteor.subscribe("services");

    return {
      loading: !handle.ready(),
      services: Services.find().fetch()
    };
  })
)(StylistJoin);
