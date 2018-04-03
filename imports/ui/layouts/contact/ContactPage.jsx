import { Meteor } from 'meteor/meteor';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'semantic-ui-react';
import _ from 'lodash';

import { FormFieldErrorMessage } from '../../components/FormInputField';

const ContactPage = props => (
  <div className="container padding-top-50 padding-bottom-50">
    <div className="row">
      <div className="col-md-offset-2 col-md-8">
        {!props.suggestStylist && (
          <Fragment>
            <p>Contact us by filling in the form below and we will get in touch with you ASAP.</p>

            <p>
              Our squad on earth are always eager to hear from you whether it&apos;s some difficulty
              with our website, comments or feedback, we would love to hear from you. (Do let us
              know how we can improve our service to better serve you)
            </p>

            <p>
              Regards<br />
              {Meteor.settings.public.appName} Family
            </p>
          </Fragment>
        )}

        {props.suggestStylist && (
          <Fragment>
            <h3>Are we missing a stylist?</h3>
            <p>Please let us know if we are missing a stylist (TODO: copy writing)</p>

            <p>
              Regards<br />
              {Meteor.settings.public.appName} Family
            </p>
          </Fragment>
        )}

        <section id="contact" className="margin-top-20">
          <Form loading={props.loading} error={!_.isEmpty(props.errors)} onSubmit={props.onSubmit}>
            <div className="margin-bottom-15">
              <input
                name="name"
                type="text"
                id="name"
                placeholder="Your Name"
                value={props.name}
                onChange={props.onChange}
              />
            </div>

            <div className="margin-bottom-15">
              <input
                name="email"
                type="email"
                id="email"
                placeholder="Email Address"
                required="required"
                value={props.email}
                onChange={props.onChange}
              />

              <FormFieldErrorMessage compact message={props.errors.email} />
            </div>

            <div className="margin-bottom-15">
              <input
                name="phone"
                type="text"
                id="phone"
                placeholder="Phone number"
                value={props.phone}
                onChange={props.onChange}
              />

              <FormFieldErrorMessage compact message={props.errors.phone} />
            </div>

            <div className="margin-bottom-15">
              <input
                name="subject"
                type="text"
                id="subject"
                placeholder="Subject"
                value={props.subject}
                onChange={props.onChange}
              />
            </div>

            <div className="margin-bottom-15">
              <textarea
                name="message"
                cols="40"
                rows="3"
                id="message"
                placeholder="Message"
                required="required"
                value={props.message}
                onChange={props.onChange}
              />

              <FormFieldErrorMessage compact message={props.errors.message} />
            </div>

            <FormFieldErrorMessage
              compact
              message={props.errors.form}
              style={{ marginTop: '0.2rem', marginBottom: '0.5rem' }}
            />

            <Button type="submit" circular color="teal" size="huge">
              Submit
            </Button>
          </Form>
        </section>
      </div>
    </div>

    {props.showSuccess && (
      <Modal size="small" open closeOnDimmerClick closeIcon onClose={props.closeSuccess}>
        <Modal.Header>Thank You!</Modal.Header>

        <Modal.Content>
          <p>
            We have received your message and would like to thank you for writing to us. One of our
            squad members will get back to you shortly.
          </p>
          <p>Have an awesome day!</p>
        </Modal.Content>
      </Modal>
    )}
  </div>
);

ContactPage.propTypes = {
  suggestStylist: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  showSuccess: PropTypes.bool.isRequired,
  closeSuccess: PropTypes.func.isRequired,
};

export default ContactPage;
