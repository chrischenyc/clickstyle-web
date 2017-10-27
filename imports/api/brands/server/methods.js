import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Brands from '../brands';

Meteor.methods({
  'brands.add': function productsAdd(name) {
    check(name, String);

    try {
      let product = Brands.findOne({ name_lower: name.toLowerCase() });

      if (!product) {
        product = Brands.insert({ name });
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
