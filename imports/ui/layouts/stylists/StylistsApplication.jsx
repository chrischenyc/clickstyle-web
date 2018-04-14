import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

import StylistsApplicationPage from './StylistsApplicationPage';
import { validateStylistJoin } from '../../../modules/validate';

class StylistApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: props.mobile || '',
      address: props.address || '',
      services: [],
      application: null,
      qualificationFile: null,
      referenceUrl: '',
      errors: {},
      submitting: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleServiceSelected = this.handleServiceSelected.bind(this);
    this.fetchCurrentApplication = this.fetchCurrentApplication.bind(this);
  }

  componentDidMount() {
    this.fetchCurrentApplication();

    Meteor.call('services.list', (error, services) => {
      if (error) {
        this.setState({
          errors: {
            message: error.reason,
          },
        });
      } else {
        this.setState({
          services: services.map(service => ({ ...service, checked: false })),
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mobile: nextProps.mobile,
      address: nextProps.address,
    });
  }

  fetchCurrentApplication() {
    Meteor.call('stylistApplications.self', (error, application) => {
      if (error) {
        this.setState({
          errors: {
            message: error.reason,
          },
        });
      } else {
        this.setState({
          application,
        });
      }
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleServiceSelected(selectedService, selected) {
    this.setState({
      services: this.state.services.map((service) => {
        if (service === selectedService) {
          return {
            ...service,
            checked: selected,
          };
        }
        return service;
      }),
    });
  }

  submitApplication(mobile, address, selectedServices, qualificationUrl, referenceUrl) {
    this.setState({ submitting: true });
    Meteor.call(
      'stylistApplications.create',
      {
        mobile,
        address,
        services: selectedServices,
        qualificationUrl,
        referenceUrl,
      },
      (error) => {
        if (error) {
          this.setState({
            submitting: false,
            errors: {
              message: error.reason,
            },
          });
        } else {
          this.setState({
            submitting: false,
            errors: {},
          });

          this.fetchCurrentApplication();
        }
      },
    );
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const {
      mobile, address, services, qualificationFile, referenceUrl,
    } = this.state;

    // only send selected services' id to server
    const selectedServices = services.filter(service => service.checked);

    const errors = validateStylistJoin(mobile, address, selectedServices, referenceUrl);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else if (qualificationFile) {
      const upload = new Slingshot.Upload(Meteor.settings.public.SlingshotS3File);
      const validateError = upload.validate(qualificationFile);

      if (validateError) {
        this.setState({ errors: { qualification: validateError.reason } });
      } else {
        this.setState({ submitting: true });

        upload.send(qualificationFile, (uploadError, qualificationUrl) => {
          if (uploadError) {
            this.setState({
              submitting: false,
              errors: { qualification: uploadError.reason },
            });
          } else {
            this.submitApplication(
              mobile,
              address,
              selectedServices,
              qualificationUrl,
              referenceUrl,
            );
          }
        });
      }
    } else {
      this.submitApplication(mobile, address, selectedServices, null, referenceUrl);
    }
  }

  render() {
    return (
      <StylistsApplicationPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        onServiceSelected={this.handleServiceSelected}
        loading={this.state.submitting}
        errors={this.state.errors}
        mobile={this.state.mobile}
        address={this.state.address}
        services={this.state.services}
        qualificationFile={this.state.qualificationFile}
        referenceUrl={this.state.referenceUrl}
        application={this.state.application}
      />
    );
  }
}

StylistApplication.defaultProps = {
  mobile: '',
  address: '',
};

StylistApplication.propTypes = {
  mobile: PropTypes.string,
  address: PropTypes.string,
};

const mapStateToProps = state => ({
  mobile: state.user.profile && state.user.profile.mobile,
  address: state.user.profile && state.user.profile.address && state.user.profile.address.raw,
});

export default connect(mapStateToProps)(StylistApplication);
