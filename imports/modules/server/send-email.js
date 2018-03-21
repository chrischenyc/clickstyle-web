import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import log from 'winston';

import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';
import Profiles from '../../api/profiles/profiles';

// core function to send email
const sendEmail = ({
  text, html, template, templateConstants, ...rest
}) => {
  if (text || html || template) {
    return new Promise((resolve, reject) => {
      try {
        Meteor.defer(() => {
          Email.send({
            ...rest,
            text: template
              ? templateToText(
                getPrivateFile(`email-templates/${template}.txt`),
                templateConstants || {},
              )
              : text,
            html: template
              ? templateToHTML(
                getPrivateFile(`email-templates/${template}.html`),
                templateConstants || {},
              )
              : html,
          });
          resolve();
        });
      } catch (exception) {
        reject(exception);
      }
    });
  }
  throw new Error("Please pass an HTML string, text, or template name to compile for your message's body.");
};

// retrieve constants from Meteor settings files
const {
  appName,
  legalName,
  about,
  homeUrl,
  faqUrl,
  contactUrl,
  searchUrl,
  joinUrl,
  privacyUrl,
  termsUrl,
  supportEmail,
  facebookUrl,
  twitterUrl,
  instagramUrl,
} = Meteor.settings.public;

export const fromAddress = `${appName} <${supportEmail}>`;

// standard constants most email templates use
const constantsFromSettings = {
  appName,
  legalName,
  about,
  homeUrl: Meteor.absoluteUrl(homeUrl),
  faqUrl: Meteor.absoluteUrl(faqUrl),
  contactUrl: Meteor.absoluteUrl(contactUrl),
  searchUrl: Meteor.absoluteUrl(searchUrl),
  joinUrl: Meteor.absoluteUrl(joinUrl),
  privacyUrl: Meteor.absoluteUrl(privacyUrl),
  termsUrl: Meteor.absoluteUrl(termsUrl),
  supportEmail,
  facebookUrl,
  twitterUrl,
  instagramUrl,
};

// add shared footers
export const templateConstants = {
  ...constantsFromSettings,
  txtFooter: templateToText(getPrivateFile('email-templates/footer.txt'), constantsFromSettings),
  htmlFooter: templateToHTML(getPrivateFile('email-templates/footer.html'), constantsFromSettings),
};

export const sendWelcomeEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  if (profile) {
    sendEmail({
      to: profile.email,
      from: fromAddress,
      subject: `Welcome to ${appName}!`,
      template: 'welcome',
      templateConstants: {
        firstName: profile.name.first,
        ...templateConstants,
      },
    }).catch((error) => {
      log.error(error);
    });
  }
};

export const sendPasswordChangedEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  if (profile) {
    sendEmail({
      to: profile.email,
      from: fromAddress,
      subject: `Account alert: ${appName} password updated`,
      template: 'password-changed',
      templateConstants: {
        firstName: profile.name.first,
        ...templateConstants,
      },
    }).catch((error) => {
      log.error(error);
    });
  }
};

export const sendStylistJoinConfirmEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  if (profile) {
    sendEmail({
      to: profile.email,
      from: fromAddress,
      subject: `We received your application to become a stylist on ${appName}`,
      template: 'stylist-join-confirm',
      templateConstants: {
        firstName: profile.name.first,
        ...templateConstants,
      },
    }).catch((error) => {
      log.error(error);
    });
  }
};

export const sendCustomerBookingRequestedEmail = ({
  stylist,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingsId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `Booking request sent for ${stylist}`,
    template: 'booking-requested-customer',
    templateConstants: {
      stylist,
      services,
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time,
      bookingsId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendCustomerBookingConfirmedEmail = ({
  stylist,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingsId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `Booking confirmed by ${stylist}`,
    template: 'booking-confirmed-customer',
    templateConstants: {
      stylist,
      services,
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time,
      bookingsId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendCustomerBookingDeclinedEmail = ({
  stylist,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingsId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `Booking declined by ${stylist}`,
    template: 'booking-declined-customer',
    templateConstants: {
      stylist,
      services,
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time,
      bookingsId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendStylistBookingRequestedEmail = ({
  stylistFirstName,
  stylistEmail,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingsId,
  bookingUrl,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `${firstName} ${lastName} sent you a booking request`,
    template: 'booking-requested-stylist',
    templateConstants: {
      stylistFirstName,
      services,
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time,
      bookingsId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendAdminEmailStylistApplication = (applicationId) => {
  const adminHost = Meteor.settings.AdminHost;
  const adminUrl = `${adminHost}/stylists/applications/${applicationId}`;

  const adminUsers = Meteor.users
    .find({ roles: Meteor.settings.public.roles.admin }, { fields: { emails: 1 } })
    .fetch();

  try {
    adminUsers.forEach((adminUser) => {
      sendEmail({
        to: adminUser.emails[0],
        from: fromAddress,
        subject: 'New stylist join application',
        template: 'stylist-join-notify-admin',
        templateConstants: {
          adminUrl,
          ...templateConstants,
        },
      });
    });
  } catch (error) {
    log.error(error);
  }
};

export const sendAdminEmailContactForm = (name, email, phone, subject, message) => {
  const adminUsers = Meteor.users
    .find({ roles: Meteor.settings.public.roles.admin }, { fields: { emails: 1 } })
    .fetch();

  try {
    adminUsers.forEach((adminUser) => {
      sendEmail({
        to: adminUser.emails[0],
        from: fromAddress,
        subject: 'New contact us form submit',
        template: 'contact-form-admin',
        templateConstants: {
          name,
          email,
          phone,
          subject,
          message,
          ...templateConstants,
        },
      });
    });
  } catch (error) {
    log.error(error);
  }
};
