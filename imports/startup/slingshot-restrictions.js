import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

// used on both front-end and back-end
Slingshot.fileRestrictions(Meteor.settings.public.SlingshotClientDirective, {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: 2 * 1024 * 1024, // 2 MB (use null for unlimited)
});
