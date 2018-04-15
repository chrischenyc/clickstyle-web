// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UserStats = new Mongo.Collection('user_stats');

UserStats.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});
UserStats.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

UserStats.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const UserStatsSchema = new SimpleSchema({
  owner: String, // Users._id
  notifications: SimpleSchema.Integer,
  messages: SimpleSchema.Integer,
  confirmedBookings: SimpleSchema.Integer,
  pendingBookings: SimpleSchema.Integer,
  cancelledBookings: SimpleSchema.Integer,
  declinedBookings: SimpleSchema.Integer,
  completedBookings: SimpleSchema.Integer,
  confirmedCustomerBookings: SimpleSchema.Integer,
  pendingCustomerBookings: SimpleSchema.Integer,
  declinedCustomerBookings: SimpleSchema.Integer,
  completedCustomerBookings: SimpleSchema.Integer,
});

UserStats.attachSchema(UserStatsSchema);

export default UserStats;
