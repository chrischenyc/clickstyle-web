import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import _ from 'lodash';
import uuid from 'uuid/v1';

import names from './mock_names.json';
import addresses from './mock_addresses.json';
import suburbs from './mock_suburbs.json';

import Profiles from '../../../api/profiles/profiles';
import Stylists from '../../../api/stylists/stylists';
import Services from '../../../api/services/services';
import Addons from '../../../api/addons/addons';
import Products from '../../../api/products/products';

// create dummy users for search
names.forEach((name) => {
  if (!Meteor.users.findOne({ profile: { name } })) {
    Accounts.createUser({
      email: `${name.first.replace(' ', '_')}.${name.last.replace(' ', '_')}@test-squad.com`,
      password: 'tester123',
      profile: {
        name,
      },
    });
  }
});

// set dummy users as stylists
// default open/close hours
const openHours = [
  {
    day: 1,
    open: true,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
  {
    day: 2,
    open: true,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
  {
    day: 3,
    open: true,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
  {
    day: 4,
    open: true,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
  {
    day: 5,
    open: true,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
  {
    day: 6,
    open: false,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
  {
    day: 7,
    open: false,
    openAtHour: 9,
    openAtMinute: 0,
    closeAtHour: 17,
    closeAtMinute: 0,
  },
];

const randomAddress = () => {
  const { suburb, state, postcode } = _.sample(suburbs);
  const { address } = _.sample(addresses);
  return {
    raw: `${address}, ${suburb}, ${state}`,
    suburb,
    state,
    postcode,
  };
};

// randomly generate 1-5 services and 1-3 subordinate addons
const allServices = Services.find().fetch();
const allAddons = Addons.find({ public: true, createdBy: 'system' }).fetch();
const randomServices = () => {
  const services = [];
  const numberOfServices = _.random(1, 5);

  for (let indexOfService = 0; indexOfService < numberOfServices; indexOfService++) {
    const service = _.sample(allServices);
    const { _id, name } = service;
    const basePrice = _.random(20, 150);

    const serviceAddons = allAddons.filter(addon => addon.serviceId === service._id);
    const addons = [];
    const numberOfAddons = _.random(1, 3);
    for (let indexOfAddon = 0; indexOfAddon < numberOfAddons; indexOfAddon++) {
      const addon = _.sample(serviceAddons);
      const addonPrice = _.random(10, 100);

      addons.push({ _id: uuid(), name: addon.name, price: addonPrice });
    }

    services.push({
      _id,
      name,
      basePrice,
      addons,
    });
  }

  return services;
};

const allProducts = Products.find().fetch();
const randomProducts = () => {
  const numberOfProducts = _.random(5, 20);
  const products = [];

  for (let indexOfProduct = 0; indexOfProduct < numberOfProducts; indexOfProduct++) {
    const { _id: productId, name } = _.sample(allProducts);
    products.push({ productId, name });
  }

  return products;
};

const photos = [
  'http://res.cloudinary.com/stylesquard/image/upload/v1511429215/dcb6fc68-3c48-4bbe-9e85-a1a6a28d78aa',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511429331/5aa23fe6-968b-4a1d-a8e0-6212d6830c5a',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511429425/ac52d420-c5d7-4a18-a7a7-6dbea7ba348f',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511429530/1a323ea3-d1ba-41cb-891c-ebbe82a7238b',
  'http://res.cloudinary.com/stylesquard/image/upload/v1511429596/297d0182-1b29-4c2e-9dfb-520f5aae7b5e',
];

names.forEach((name) => {
  const user = Meteor.users.findOne({ profile: { name } });
  if (user) {
    Roles.addUsersToRoles(user._id, [Meteor.settings.public.roles.stylist]);

    Profiles.update(
      { owner: user._id },
      {
        $set: {
          mobile: '0466666666',
          address: randomAddress(),
          products: randomProducts(),
          photo: _.sample(photos),
        },
      },
    );

    Stylists.upsert(
      { owner: user._id },
      {
        $set: {
          owner: user._id,
          services: randomServices(),
          openHours,
          public: true,
        },
      },
    );
  }
});
