import '../../api/users/server/methods';
import '../../api/users/server/hooks';
import '../../api/bookings/server/methods';
import '../../api/profiles/server/publications';
import '../../api/profiles/server/methods';
import '../../api/products/server/publications';
import '../../api/services/server/publications';
import '../../api/services/server/methods';
import '../../api/addons/server/publications';
import '../../api/stylist_applications/server/methods';
import '../../api/stylist_applications/server/publications';
import '../../api/stylist_applications/server/hooks';
import '../../api/stylists/server/publications';
import '../../api/stylists/server/methods';
import '../../api/suburbs/server/methods';
import '../../api/featured/server/methods';
import '../../api/user_contacts/server/methods';
import '../../api/reviews/server/methods';
import '../../api/notifications/server/methods';
import '../../api/booking_activities/server/methods';

import Profiles from '../../api/profiles/profiles';

Profiles.update({}, { $set: { notifications: 0 } }, { multi: true });
