import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Input, Button, Popup } from 'semantic-ui-react';
import GeoSuggest from 'react-geosuggest';

import '../../components/GeoSuggest.css';

const SearchBar = () => (
  <div style={{ padding: '0 32px' }}>
    <Popup
      trigger={
        <Input
          icon="search"
          iconPosition="left"
          color={Meteor.settings.public.semantic.color}
          placeholder="haircut, make-up, stylist"
          size="huge"
          style={{ width: '25rem', margin: '0 2px' }}
        />
      }
      content="TODO: display services categories"
      on="hover"
      position="bottom center"
    />

    <Popup
      trigger={
        <Button
          basic
          size="huge"
          color={Meteor.settings.public.semantic.color}
          content="Any Date"
          icon="calendar"
          style={{ width: '15rem', margin: '0 2px' }}
        />
      }
      content="TODO: display calendar"
      on="hover"
      position="bottom center"
    />

    <Button color={Meteor.settings.public.semantic.color} size="huge" style={{ margin: '0 2px' }}>
      Search
    </Button>
  </div>
);

export default SearchBar;
