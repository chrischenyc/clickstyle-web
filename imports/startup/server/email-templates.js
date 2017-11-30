import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import getPrivateFile from '../../modules/server/get-private-file';
import templateToHTML from '../../modules/server/handlebars-email-to-html';
import templateToText from '../../modules/server/handlebars-email-to-text';

import { fromAddress, templateVars } from '../../modules/server/send-email';

// override Meteor default Accounts email template

const { appName } = templateVars;
const { emailTemplates } = Accounts;

emailTemplates.siteName = appName;
emailTemplates.from = fromAddress;

emailTemplates.verifyEmail = {
  subject() {
    return 'Verify Your Email Address';
  },
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    return templateToHTML(getPrivateFile('email-templates/verify-email.html'), {
      firstName: user.profile.name.first,
      verifyUrl: urlWithoutHash,
      ...templateVars,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`Verify Email Link: ${urlWithoutHash}`); // eslint-disable-line
    return templateToText(getPrivateFile('email-templates/verify-email.txt'), {
      firstName: user.profile.name.first,
      verifyUrl: urlWithoutHash,
      ...templateVars,
    });
  },
};

emailTemplates.resetPassword = {
  subject() {
    return 'Reset Your Password';
  },
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    return templateToHTML(getPrivateFile('email-templates/reset-password.html'), {
      firstName: user.profile.name.first,
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash,
      ...templateVars,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    if (Meteor.isDevelopment) console.info(`Reset Password Link: ${urlWithoutHash}`); // eslint-disable-line
    return templateToText(getPrivateFile('email-templates/reset-password.txt'), {
      firstName: user.profile.name.first,
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash,
      ...templateVars,
    });
  },
};
