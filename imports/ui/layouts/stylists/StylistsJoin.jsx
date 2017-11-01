import { withTracker } from "meteor/react-meteor-data";
import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import Services from "../../../api/services/services";
import StylistsJoinPage from "./StylistsJoinPage";

class StylistJoin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      services: props.services.map(service => {
        return { ...service, checked: false };
      }),
      file: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleServiceSelected = this.handleServiceSelected.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
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
        services={this.state.services}
        file={this.state.file}
      />
    );
  }
}

StylistJoin.defaultProps = {
  services: [],
  loading: true
};

StylistJoin.propTypes = {
  services: PropTypes.array,
  loading: PropTypes.bool
};

export default withTracker(() => {
  const handle = Meteor.subscribe("services");

  return {
    services: Services.find().fetch(),
    loading: !handle.ready()
  };
})(StylistJoin);
