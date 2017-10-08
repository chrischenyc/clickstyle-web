// definition of the Bookings collection

export default (Bookings = new Mongo.Collection('bookings'));

Bookings.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const BookingsSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 200,
  },
  location: {
    type: String,
    label: 'Location',
  },
  summary: {
    type: String,
    label: 'Brief summary',
    optional: true,
    max: 1000,
  },
});

Bookings.attachSchema(BookingsSchema);

Bookings.allow({
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
Bookings.deny({
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
