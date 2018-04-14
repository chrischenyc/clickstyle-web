import { Meteor } from 'meteor/meteor';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import Products from '../products';

Meteor.methods({
  'products.list': function listProducts() {
    try {
      return Products.find({}, { fields: { name: 1 } }).fetch();
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['products.list'],
  limit: 5,
  timeRange: 1000,
});
