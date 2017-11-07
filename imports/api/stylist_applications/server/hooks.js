import StylistApplications from '../stylist_applications';
import {
  sendStylistJoinConfirmEmail,
  sendAdminEmailStylistApplication,
} from '../../../modules/server/send-email';

StylistApplications.after.insert((userId, application) => {
  sendStylistJoinConfirmEmail(userId);
  sendAdminEmailStylistApplication(application._id);
});
