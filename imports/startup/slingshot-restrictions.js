import { Meteor } from "meteor/meteor";
import { Slingshot } from "meteor/edgee:slingshot";

// used on both front-end and back-end
Slingshot.fileRestrictions(Meteor.settings.public.SlingshotCloudinaryImage, {
  allowedFileTypes: ["image/png", "image/jpeg", "image/jpg"],
  maxSize: Meteor.settings.public.image.maxFileSize * 1024 * 1024 //  MB (use null for unlimited)
});
