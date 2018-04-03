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
    return templateToHTML(getPrivateFile('email-templates/user-verifyEmail.html'), {
      firstName: user.profile.name.first,
      verifyUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');

    return templateToText(getPrivateFile('email-templates/user-verifyEmail.txt'), {
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
    return templateToHTML(getPrivateFile('email-templates/user-resetPassword.html'), {
      firstName: user.profile.name.first,
      emailAddress: user.emails[0].address,
      resetUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');

    return templateToText(getPrivateFile('email-templates/user-resetPassword.txt'), {
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
    return templateToHTML(getPrivateFile('email-templates/user-enrollAccount.html'), {
      firstName: user.profile.name.first,
      enrollUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
  text(user, url) {
    const urlWithoutHash = url.replace('#/', '');

    return templateToText(getPrivateFile('email-templates/user-enrollAccount.txt'), {
      firstName: user.profile.name.first,
      enrollUrl: urlWithoutHash,
      ...templateConstants,
    });
  },
};
