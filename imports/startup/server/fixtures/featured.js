import Featured from '../../../api/featured/featured';

if (!Featured.findOne()) {
  Featured.insert({ homeFeaturedStylists: [] });
}
