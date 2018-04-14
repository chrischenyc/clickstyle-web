import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import log from 'winston';

import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';
import Profiles from '../../api/profiles/profiles';
import { dateString } from '../format-date';

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
      template: 'user-welcome',
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
      template: 'user-passwordChanged',
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
      template: 'stylist-applicationConfirmed',
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
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `You sent ${stylist} a request for booking on ${dateString(time)}`,
    template: 'customer-bookingRequested',
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
      bookingId,
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
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `${stylist} confirmed your request for a booking on ${dateString(time)}`,
    template: 'customer-bookingConfirmedByStylist',
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
      bookingId,
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
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `${stylist} declined your request for a booking on ${dateString(time)}`,
    template: 'customer-bookingDeclinedByStylist',
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
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendCustomerBookingCancelledByStylistEmail = ({
  stylist,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `${stylist} cancelled a booking on ${dateString(time)}`,
    template: 'customer-bookingCancelledByStylist',
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
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendCustomerBookingCompletedEmail = ({
  stylist,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `${stylist} completed a booking on ${dateString(time)}`,
    template: 'customer-bookingCompleted',
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
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendCustomerPaymentEmail = ({
  paymentId,
  total,
  description,
  firstName,
  email,
  time,
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `Billing receipt for a booking on ${dateString(time)}`,
    template: 'customer-bookingPayment',
    templateConstants: {
      paymentId,
      total,
      description,
      firstName,
      email,
      bookingId,
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
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `${firstName} requested a booking on ${dateString(time)}`,
    template: 'stylist-bookingRequested',
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
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendStylistBookingCancelledByCustomerEmail = ({
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
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `${firstName} cancelled a booking on ${dateString(time)}`,
    template: 'stylist-bookingCancelledByCustomer',
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
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendStylistBookingCompletedEmail = ({
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
  bookingId,
  bookingUrl,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `Yay, you completed a booking on ${dateString(time)}`,
    template: 'stylist-bookingCompleted',
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
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendStylistBookingReviewedEmail = ({
  stylistFirstName,
  stylistEmail,
  firstName,
  bookingId,
  bookingUrl,
  time,
  rating,
  review,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `${firstName} reviewed a booking on ${dateString(time)}`,
    template: 'stylist-bookingReviewed',
    templateConstants: {
      stylistFirstName,
      firstName,
      bookingId,
      bookingUrl: Meteor.absoluteUrl(bookingUrl),
      rating,
      review,
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendAdminStylistApplicationEmail = (applicationId) => {
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
        template: 'admin-newStylistApplication',
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

export const sendAdminContactFormEmail = (name, email, phone, subject, message) => {
  const adminUsers = Meteor.users
    .find({ roles: Meteor.settings.public.roles.admin }, { fields: { emails: 1 } })
    .fetch();

  try {
    adminUsers.forEach((adminUser) => {
      sendEmail({
        to: adminUser.emails[0],
        from: fromAddress,
        subject: 'New contact us form submit',
        template: 'admin-contactFormSubmitted',
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

export const sendAdminConfirmedBookingCancelledByStylistEmail = (bookingId) => {
  const adminHost = Meteor.settings.AdminHost;
  const adminUrl = `${adminHost}/bookings/${bookingId}`;

  const adminUsers = Meteor.users
    .find({ roles: Meteor.settings.public.roles.admin }, { fields: { emails: 1 } })
    .fetch();

  try {
    adminUsers.forEach((adminUser) => {
      sendEmail({
        to: adminUser.emails[0],
        from: fromAddress,
        subject: 'A confirmed booking has been cancelled by stylist',
        template: 'admin-confirmedBookingCancelledByStylist',
        templateConstants: {
          adminUrl,
          bookingId,
          ...templateConstants,
        },
      });
    });
  } catch (error) {
    log.error(error);
  }
};
