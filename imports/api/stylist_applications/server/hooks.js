import StylistApplications from '../stylist_applications';
import {
  sendStylistJoinConfirmEmail,
  sendAdminStylistApplicationEmail,
} from '../../../modules/server/send-email';

StylistApplications.after.insert((userId, application) => {
  sendStylistJoinConfirmEmail(userId);
  sendAdminStylistApplicationEmail(application._id);
});
