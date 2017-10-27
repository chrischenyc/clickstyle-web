import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Products from '../products';

Meteor.methods({
  'products.add': function productsAdd(name) {
    check(name, String);

    try {
      let product = Products.findOne({ name_lower: name.toLowerCase() });

      if (!product) {
        product = Products.insert({ name });
      }

      return product;
    } catch (exception) {
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['products.add'],
  limit: 5,
  timeRange: 1000,
});
