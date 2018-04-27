// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Messages = new Mongo.Collection('messages');

Messages.allow({
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
Messages.deny({
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

Messages.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const MessagesSchema = new SimpleSchema({
  conversation: String, // Conversations._id
  sender: String,
  read: Boolean,
  content: { type: String, max: 1000 },
});

Messages.attachSchema(MessagesSchema);

export default Messages;
