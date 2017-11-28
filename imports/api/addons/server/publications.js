import { Meteor } from 'meteor/meteor';
import Addons from '../addons';

Meteor.publish('addons', () =>
  Addons.find(
    { published: true },
    {
      // hide fields in the return
      fields: {
        createdAt: 0,
        updatedAt: 0,
        createdBy: 0,
        published: 0,
      },
    },
  ));

Meteor.publish('addons.system.name', () =>
  Addons.find(
    { published: true, createdBy: 'system' },
    {
      // hide fields in the return
      fields: {
        name: 1,
        serviceId: 1,
      },
    },
  ));
