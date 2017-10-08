import { Meteor } from 'meteor/meteor';

import React from 'react';
import { render } from 'react-dom';

import '../imports/startup/client/index';

import App from '../imports/ui/layouts/App';

Meteor.startup(() => {
  render(<App />, document.getElementById('react-root'));
});
