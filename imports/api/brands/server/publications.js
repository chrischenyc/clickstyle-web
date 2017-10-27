import { Meteor } from 'meteor/meteor';
import Brands from '../brands';

Meteor.publish('brands', () =>
  Brands.find(
    {},
    {
      // hide fields in the return
      fields: { createdAt: 0, updatedAt: 0 },
    },
  ));
