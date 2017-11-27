// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Suburbs = new Mongo.Collection('suburbs');

Suburbs.allow({
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
Suburbs.deny({
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

Suburbs.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const SuburbsSchema = new SimpleSchema({
  name: {
    type: String,
  },
  postcode: {
    type: String,
  },
  state: {
    type: String,
  },
  lat: {
    type: Number,
    decimal: true,
  },
  lon: {
    type: Number,
    decimal: true,
  },
  // true if the suburb has stylists providing services
  published: {
    type: Boolean,
  },
});

Suburbs.attachSchema(SuburbsSchema);

export default Suburbs;
