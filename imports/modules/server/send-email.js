import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';

import Profiles from '../../api/profiles/profiles';

// core function to send email
const sendEmail = ({
  text, html, template, templateVars, ...rest
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
                templateVars || {},
              )
              : text,
            html: template
              ? templateToHTML(
                getPrivateFile(`email-templates/${template}.html`),
                templateVars || {},
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

// helpers
const {
  applicationName,
  supportEmail,
  facebookUrl,
  twitterUrl,
  instagramUrl,
} = Meteor.settings.public;
const fromAddress = `${applicationName} <${supportEmail}>`;

export const sendWelcomeEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `Welcome to ${applicationName}!`,
    template: 'welcome',
    templateVars: {
      firstName: profile.name.first,
      applicationName,
      welcomeUrl: Meteor.absoluteUrl(''),
      supportEmail,
      facebookUrl,
      twitterUrl,
      instagramUrl,
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};

export const sendPasswordChangedEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `Account alert: ${applicationName} password updated`,
    template: 'password-changed',
    templateVars: {
      applicationName,
      firstName: profile.name.first,
      contactUrl: Meteor.absoluteUrl('/contact'),
      supportEmail,
      facebookUrl,
      twitterUrl,
      instagramUrl,
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};

export const sendStylistJoinConfirmEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `We received your application to become a stylist on ${applicationName}`,
    template: 'stylist-join-confirm',
    templateVars: {
      applicationName,
      firstName: profile.name.first,
      supportEmail,
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
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
        templateVars: {
          applicationName,
          adminUrl,
          supportEmail,
        },
      });
    });
  } catch (error) {
    /* eslint-disable no-console */
    console.error(error);
    /* eslint-enable no-console */
  }
};
