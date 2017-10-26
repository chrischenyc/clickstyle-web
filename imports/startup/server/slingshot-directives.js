import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

// https://github.com/jimmiebtlr/meteor-slingshot-cloudinary
Slingshot.createDirective(Meteor.settings.public.SlingshotCloudinaryImage, Slingshot.Cloudinary, {
  authorize() {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(403);
    }

    return true;
  },
  key() {
    return Meteor.uuid();
  },
  tags: [Meteor.settings.public.SlingshotTag],
});
