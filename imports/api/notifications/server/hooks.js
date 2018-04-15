import Notifications from '../notifications';
import UserStats from '../../user_stats/user_stats';

Notifications.after.insert((userId, notification) => {
  UserStats.update({ owner: notification.recipient }, { $inc: { notifications: 1 } });
});

Notifications.after.update((userId, notification, fieldNames, modifier) => {
  if (modifier.$set && modifier.$set.dismissed && modifier.$set.dismissed === true) {
    UserStats.update({ owner: notification.recipient }, { $inc: { notifications: -1 } });
  }
});

Notifications.after.remove((userId, notification) => {
  if (notification.dismissed === false) {
    UserStats.update({ owner: notification.recipient }, { $inc: { notifications: -1 } });
  }
});
