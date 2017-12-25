import React from 'react';
import PropTypes from 'prop-types';
import { Form, Checkbox, Search, Dropdown, Popup } from 'semantic-ui-react';
import _ from 'lodash';

import { Button } from '../../../components/elements';

const StylistAvailableAreasPage = ({
  radius,
  onChange,
  onSubmit,
  onSelectSuburb,
  loading,
  saving,
  pristine,
  error,
  searchingSuburbs,
  matchedSuburbs,
  suburb,
  canTravel,
}) => (
  <div className="container">
    <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(error)}>
      <p>TODO: write something to educate stylists what this page is about</p>

      <Form.Field inline>
        I want to provide my services within
        <Dropdown
          name="radius"
          placeholder="select distance"
          options={[
            { text: '0km', value: 0 },
            { text: '5km', value: 5 },
            { text: '10km', value: 10 },
            { text: '15km', value: 15 },
            { text: '20km', value: 20 },
            { text: '25km', value: 25 },
            { text: '30km', value: 30 },
            { text: '35km', value: 35 },
            { text: '40km', value: 40 },
            { text: '45km', value: 45 },
            { text: '50km', value: 50 },
          ]}
          value={radius}
          onChange={(event, data) => {
            onChange({ target: data });
          }}
          style={{ marginLeft: '1rem' }}
        />
        from
        <Search
          name="suburb"
          placeholder="suburb/postcode"
          style={{ display: 'inline' }}
          loading={searchingSuburbs}
          onResultSelect={(e, { result }) => {
            onSelectSuburb(result);
          }}
          onSearchChange={(e, data) => {
            onChange({ target: data });
          }}
          results={matchedSuburbs}
          showNoResults={false}
          value={suburb}
        />
      </Form.Field>

      <Form.Field>
        <Checkbox
          name="canTravel"
          checked={canTravel}
          label="I'm willing to travel to further regions to provide my services at an additional cost."
          onChange={(event, data) => {
            onChange({ target: { name: data.name, value: data.checked } });
          }}
        />
        <Popup
          trigger={<i className="fa fa-question-circle" />}
          content="checking this box will make you appears across all suburbs in your state"
        />
      </Form.Field>

      <Button
        color="teal"
        size="massive"
        type="submit"
        disabled={pristine || !_.isEmpty(error)}
        loading={saving}
      >
        Save
      </Button>
      {!_.isEmpty(error) && <div className="notification error"> {error} </div>}
    </Form>
  </div>
);

StylistAvailableAreasPage.propTypes = {
  radius: PropTypes.number,
  searchingSuburbs: PropTypes.bool.isRequired,
  matchedSuburbs: PropTypes.array.isRequired,
  suburb: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelectSuburb: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  canTravel: PropTypes.bool.isRequired,
};

export default StylistAvailableAreasPage;
