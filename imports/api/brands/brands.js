// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Brands = new Mongo.Collection('brands');

Brands.allow({
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
Brands.deny({
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

Brands.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const BrandsSchema = new SimpleSchema({
  // required fields
  name: {
    type: String,
    unique: true,
  },
  system: {
    type: Boolean,
  },
});

Brands.attachSchema(BrandsSchema);

export default Brands;
