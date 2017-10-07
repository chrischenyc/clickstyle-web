export default (Jobs = new Mongo.Collection('jobs'));

Jobs.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const JobsSchema = new SimpleSchema({
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

Jobs.attachSchema(JobsSchema);

Jobs.allow({
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
Jobs.deny({
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
