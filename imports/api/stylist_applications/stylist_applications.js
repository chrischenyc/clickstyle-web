// definition of the StylistApplications collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const StylistApplications = new Mongo.Collection('stylists_applications');

StylistApplications.allow({
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
StylistApplications.deny({
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

StylistApplications.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const ApprovalSchema = new SimpleSchema({
  approved: {
    type: Boolean,
  },
  adminId: {
    type: String,
    optional: true,
  },
  date: {
    type: Date,
    optional: true,
  },
});

const StylistApplicationsSchema = new SimpleSchema({
  // required fields
  userId: {
    type: String,
  },
  mobile: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
    max: 20,
  },
  address: {
    type: String,
    max: 200,
  },
  services: {
    type: [String],
  },
  qualification: {
    type: String,
    optional: true,
  },
  url: {
    type: String,
    optional: true,
  },
  approval: {
    type: ApprovalSchema,
  },
});

StylistApplications.attachSchema(StylistApplicationsSchema);

export default StylistApplications;
