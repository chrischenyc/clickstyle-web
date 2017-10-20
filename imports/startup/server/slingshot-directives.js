import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

Slingshot.createDirective(Meteor.settings.public.SlingshotClientDirective, Slingshot.S3Storage, {
  acl: 'public-read',
  authorize() {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(403);
    }

    return true;
  },
  key(file, metaContext) {
    // Store file into a directory by the user's id.
    return `${this.userId}/${metaContext.path}/${Date.now()}_${file.name}`;
  },
});
