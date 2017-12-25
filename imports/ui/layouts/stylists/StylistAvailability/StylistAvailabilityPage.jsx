import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Table, Checkbox, Icon } from 'semantic-ui-react';
import _ from 'lodash';

import { PrimaryColor } from '../../../../modules/client/constants';
import HoursDropdown from '../../../components/HoursDropdown';
import MinutesDropdown from '../../../components/MinutesDropdown';
import { dayOfWeekAsString } from '../../../../modules/format-date';

const StylistAvailableTimePage = ({
  openHours,
  onChange,
  onSubmit,
  loading,
  saving,
  pristine,
  errors,
}) => (
  <div className="container">
    <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
      <p>TODO: write something to educate stylists what this page is about</p>

      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Day</Table.HeaderCell>
            <Table.HeaderCell>Available From</Table.HeaderCell>
            <Table.HeaderCell>Available To</Table.HeaderCell>
            <Table.HeaderCell>Open</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {openHours &&
            _.sortBy(openHours, ['day']).map((openHour) => {
              const error = errors[openHour.day];

              return (
                <Table.Row key={openHour.day}>
                  <Table.Cell>{dayOfWeekAsString(openHour.day)}</Table.Cell>

                  <Table.Cell error={!_.isEmpty(error)}>
                    <HoursDropdown
                      hour={openHour.openAtHour}
                      onChange={(event, data) => {
                        onChange(openHour.day, 'openAtHour', data.value);
                      }}
                      disabled={!openHour.open}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                    <MinutesDropdown
                      minute={openHour.openAtMinute}
                      onChange={(event, data) => {
                        onChange(openHour.day, 'openAtMinute', data.value);
                      }}
                      disabled={!openHour.open}
                    />
                    {!_.isEmpty(error) && (
                      <div>
                        <Icon name="attention" />
                        {error}
                      </div>
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <HoursDropdown
                      hour={openHour.closeAtHour}
                      onChange={(event, data) => {
                        onChange(openHour.day, 'closeAtHour', data.value);
                      }}
                      disabled={!openHour.open}
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
                    <MinutesDropdown
                      minute={openHour.closeAtMinute}
                      onChange={(event, data) => {
                        onChange(openHour.day, 'closeAtMinute', data.value);
                      }}
                      disabled={!openHour.open}
                    />
                  </Table.Cell>

                  <Table.Cell>
                    <Checkbox
                      toggle
                      checked={openHour.open}
                      onChange={(event, data) => {
                        onChange(openHour.day, 'open', data.checked);
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>

      <Button
        color={PrimaryColor}
        size="massive"
        type="submit"
        disabled={pristine || !_.isEmpty(errors)}
        loading={saving}
      >
        Save
      </Button>

      {!_.isEmpty(errors.message) && <div className="notification error"> {errors.message} </div>}
    </Form>
  </div>
);

StylistAvailableTimePage.propTypes = {
  openHours: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired, // (day, name, value)
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistAvailableTimePage;
