import { Meteor } from 'meteor/meteor';
import MailChimp from 'mailchimp-api-v3';
import log from 'winston';

import Profiles from '../../api/profiles/profiles';

const mailChimpAPI = new MailChimp(Meteor.settings.MailChimpAPIKey);

const subscribeToList = (userId, listId) => {
  const profile = Profiles.findOne({ owner: userId });

  mailChimpAPI
    .post(`/lists/${listId}/members`, {
      email_address: profile.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: profile.name.first,
        LNAME: profile.name.last,
      },
    })
    .catch((error) => {
      log.error(
        'Meteor.methods: users.after.insert.MailChimp',
        `userId: ${this.userId}`,
        `error: ${error.message}`,
      );
    });
};

export default subscribeToList;
