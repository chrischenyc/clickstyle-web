import Suburbs from '../../../api/suburbs/suburbs';

const suburbs = require('./aus_suburbs.json');

if (Suburbs.find().fetch().length === 0) {
  suburbs.forEach((suburb) => {
    Suburbs.insert({
      ...suburb,
      name: suburb.name.toLowerCase().replace(/(^| )(\w)/g, s => s.toUpperCase()),
      published: false,
      active: suburb.state !== 'NT',
    });
  });
}
