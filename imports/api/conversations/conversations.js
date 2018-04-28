// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Conversations = new Mongo.Collection('conversations');

Conversations.allow({
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
Conversations.deny({
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

Conversations.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const ConversationsSchema = new SimpleSchema({
  booking: String, // Bookings._id
  participants: Array,
  'participants.$': String, // Users._id,
});

Conversations.attachSchema(ConversationsSchema);

export default Conversations;
