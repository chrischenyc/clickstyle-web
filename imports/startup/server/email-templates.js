import { Accounts } from 'meteor/accounts-base';
import getPrivateFile from '../../modules/server/get-private-file';
import templateToHTML from '../../modules/server/handlebars-email-to-html';
import templateToText from '../../modules/server/handlebars-email-to-text';

import { fromAddress, templateConstants } from '../../modules/server/send-email';

// override Meteor default Accounts email template

const { appName } = templateConstants;
const { emailTemplates } = Accounts;

emailTemplates.siteName = appName;
emailTemplates.from = fromAddress;

emailTemplates.verifyEmail = {
  ...emailTemplates.resetPassword,
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    return templateToHTML(getPrivateFile('email-templates/verify-email.html'), {
      firstName: user.profile.name.first,
      verifyUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');

    return templateToText(getPrivateFile('email-templates/verify-email.txt'), {
      firstName: user.profile.name.first,
      verifyUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
};

emailTemplates.resetPassword = {
  ...emailTemplates.resetPassword,
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    return templateToHTML(getPrivateFile('email-templates/reset-password.html'), {
      firstName: user.profile.name.first,
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');

    return templateToText(getPrivateFile('email-templates/reset-password.txt'), {
      firstName: user.profile.name.first,
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
};

emailTemplates.enrollAccount = {
  ...emailTemplates.enrollAccount,
  html(user, url) {
    const urlWithoutHash = url.replace('#/', '');
    return templateToHTML(getPrivateFile('email-templates/enroll-account.html'), {
      firstName: user.profile.name.first,
      enrollUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');

    return templateToText(getPrivateFile('email-templates/enroll-account.txt'), {
      firstName: user.profile.name.first,
      enrollUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
};
