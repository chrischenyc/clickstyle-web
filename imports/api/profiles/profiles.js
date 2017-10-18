// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Profiles = new Mongo.Collection('profiles');

Profiles.allow({
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
Profiles.deny({
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

Profiles.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

// TODO: complete Profiles schema
const NameSchema = new SimpleSchema({
  first: {
    type: String,
    optional: true,
    max: 50,
  },
  last: {
    type: String,
    optional: true,
    max: 50,
  },
});

const PhotoSchema = new SimpleSchema({
  origin: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
});

const AddressSchema = new SimpleSchema({
  state: {
    type: String,
    optional: true,
    max: 3, // TODO: enhance regex
  },
  postcode: {
    type: String,
    optional: true,
    regEx: /^[0-9]{4}$/, // TODO: enhance regex
  },
  suburb: {
    type: String,
    optional: true,
    max: 50,
  },
  address1: {
    type: String,
    optional: true,
    max: 100,
  },
  address2: {
    type: String,
    optional: true,
    max: 100,
  },
  raw: {
    type: String,
    optional: true,
    max: 200,
  },
});

const ProfilesSchema = new SimpleSchema({
  // required fields
  owner: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  name: { type: NameSchema },

  // optional fields
  // TODO: do we need gender
  gender: {
    type: String,
    optional: true,
    regEx: /^male$|^female$|^other$/,
  },
  about: {
    type: String,
    optional: true,
    max: 1000,
  },
  photo: {
    type: PhotoSchema,
    optional: true,
  },
  mobile: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone, // TODO: enhance regex
    max: 20,
    optional: true,
  },
  address: {
    type: AddressSchema,
    optional: true,
  },
});

Profiles.attachSchema(ProfilesSchema);

export default Profiles;
