import Notifications from '../notifications';
import Profiles from '../../profiles/profiles';

Notifications.after.insert((userId, notification) => {
  Profiles.update({ owner: notification.recipient }, { $inc: { notifications: 1 } });
});

Notifications.after.update((userId, notification, fieldNames, modifier) => {
  if (modifier.$set && modifier.$set.dismissed && modifier.$set.dismissed === true) {
    Profiles.update({ owner: notification.recipient }, { $inc: { notifications: -1 } });
  }
});

Notifications.after.remove((userId, notification) => {
  if (notification.dismissed === false) {
    Profiles.update({ owner: notification.recipient }, { $inc: { notifications: -1 } });
  }
});
