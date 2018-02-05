import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const ContactPage = props => (
  <div className="container padding-top-50 padding-bottom-50">
    <div className="row">
      <div className="col-md-offset-2 col-md-8">
        {!props.suggestStylist && (
          <div>
            <p>Contact us by filling in the form below and we will get in touch with you ASAP.</p>

            <p>
              Our squad on earth are always eager to hear from you wether it&apos;s some difficulty
              with our website, comments or feedback, we would love to hear from you. (Do let us
              know how we can improve our service to better serve you)
            </p>

            <p>
              Regards<br />
              {Meteor.settings.public.appName} Family
            </p>
          </div>
        )}

        {props.suggestStylist && (
          <div>
            <h3>Are we missing a stylist?</h3>
            <p>Please let us know if we are missing a stylist (TODO: copy writing)</p>

            <p>
              Regards<br />
              {Meteor.settings.public.appName} Family
            </p>
          </div>
        )}

        <section id="contact" className="margin-top-20">
          <form
            method="post"
            action="contact.php"
            name="contactform"
            id="contactform"
            autoComplete="on"
          >
            <div className="row">
              <div className="col-md-6">
                <div>
                  <input
                    name="name"
                    type="text"
                    id="name"
                    placeholder="Your Name"
                    required="required"
                    value={props.name}
                    onChange={props.onChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div>
                  <input
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    pattern="^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$"
                    required="required"
                    value={props.email}
                    onChange={props.onChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <input
                name="phone"
                type="text"
                id="phone"
                placeholder="Phone number"
                value={props.phone}
                onChange={props.onChange}
              />
            </div>

            <div>
              <input
                name="subject"
                type="text"
                id="subject"
                placeholder="Subject"
                required="required"
                value={props.subject}
                onChange={props.onChange}
              />
            </div>

            <div>
              <textarea
                name="message"
                cols="40"
                rows="3"
                id="message"
                placeholder="Message"
                spellCheck="true"
                required="required"
                value={props.message}
                onChange={props.onChange}
              />
            </div>

            <Button type="submit" circular color="teal" size="huge">
              Submit
            </Button>
          </form>
        </section>
      </div>
    </div>
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
};

export default ContactPage;
