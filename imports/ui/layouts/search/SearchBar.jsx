import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Input, Button, Popup, Grid } from 'semantic-ui-react';

import SemanticGeoSuggest from '../../components/SemanticGeoSuggest/SemanticGeoSuggest';

const SearchBar = () => (
  <Grid stackable stretched>
    <Grid.Row>
      <Grid.Column computer="3" tablet="5" style={{ padding: '0 2px' }}>
        <Popup
          trigger={
            <Input
              fluid
              icon="search"
              iconPosition="left"
              color={Meteor.settings.public.semantic.color}
              placeholder="haircut, make-up, stylist"
              size="large"
            />
          }
          content="TODO: display services categories"
          on="focus"
          position="bottom center"
        />
      </Grid.Column>

      <Grid.Column computer="2" tablet="4" style={{ padding: '0 2px' }}>
        <SemanticGeoSuggest
          fluid
          size="large"
          placeholder="suburb, postcode"
          country="au"
          name="address.raw"
          onChange={(value) => {
            // convert to generic onChange param
            // onChange({ target: { name: 'address.raw', value } });
          }}
          onSuggestSelect={(suggest) => {
            // force onChange as well
            // onChange({ target: { name: 'address.raw', value: suggest.label } });
            // onAddressSuggest(suggest);
          }}
          style={{ width: '100%' }}
        />
      </Grid.Column>

      <Grid.Column computer="2" tablet="3" style={{ padding: '0 2px' }}>
        <Popup
          trigger={
            <Button
              fluid
              basic
              size="large"
              color={Meteor.settings.public.semantic.color}
              content="Any Date"
              icon="calendar"
            />
          }
          content="TODO: display calendar"
          on="hover"
          position="bottom center"
        />
      </Grid.Column>

      <Grid.Column computer="2" tablet="3" style={{ padding: '0 2px' }}>
        <Button fluid color={Meteor.settings.public.semantic.color} size="large">
          Search
        </Button>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default SearchBar;
