import { withTracker } from "meteor/react-meteor-data";
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { compose } from "redux";
import { connect } from "react-redux";

import Services from "../../../api/services/services";
import StylistsJoinPage from "./StylistsJoinPage";

class StylistJoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: "",
      address: "",
      services: [],
      file: null,
      url: "",
      errors: {}
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

    /*
    const errors = validateUserSignUp(
      this.state.email,
      this.state.firstName,
      this.state.lastName,
      this.state.password,
    );

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      // http://docs.meteor.com/api/passwords.html#Accounts-createUser
      Accounts.createUser(
        {
          email: this.state.email,
          password: this.state.password,
          profile: {
            name: {
              first: this.state.firstName,
              last: this.state.lastName,
            },
          },
        },
        (error) => {
          if (error) {
            this.setState({
              loading: false,
              errors: {
                message: error.reason,
              },
            });
          } else {
            this.setState({
              loading: false,
              errors: {},
            });
          }
        },
      );
    }
    */
  }

  render() {
    return (
      <StylistsJoinPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onServiceSelected={this.handleServiceSelected}
        loading={this.props.loading}
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
