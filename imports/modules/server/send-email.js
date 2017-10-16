import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';
import formatDate from '../../modules/format-date';

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
const { applicationName, supportEmail } = Meteor.settings.public.company;
const fromAddress = `${applicationName} <${supportEmail}>`;

export const sendWelcomeEmail = (email, firstName) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `Welcome to ${applicationName}!`,
    template: 'welcome',
    templateVars: {
      applicationName,
      firstName,
      supportEmail,
      welcomeUrl: Meteor.absoluteUrl('dashboard'),
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};

export const sendPasswordChangedEmail = (email, firstName) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `Account alert: ${applicationName} password updated`,
    template: 'password-changed',
    templateVars: {
      applicationName,
      firstName,
      supportEmail,
      accountEmail: email,
      changedOn: formatDate(Date.now(0)),
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};
