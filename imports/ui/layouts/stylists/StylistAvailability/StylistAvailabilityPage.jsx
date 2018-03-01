import React from 'react';
import PropTypes from 'prop-types';
import { Form, Table, Checkbox, Button, Container } from 'semantic-ui-react';
import _ from 'lodash';

import TimeInput from '../../../components/TimeInput';
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
  <Container>
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
                    <TimeInput
                      value={openHour.openAt}
                      onChange={(value) => {
                        onChange(openHour.day, 'openAt', value);
                      }}
                      disabled={!openHour.open}
                    />
                    {!_.isEmpty(error) && <div>{error}</div>}
                  </Table.Cell>

                  <Table.Cell>
                    <TimeInput
                      value={openHour.closeAt}
                      onChange={(value) => {
                        onChange(openHour.day, 'closeAt', value);
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
        circular
        size="huge"
        color="teal"
        type="submit"
        disabled={pristine || !_.isEmpty(errors)}
        loading={saving}
      >
        Save
      </Button>

      {!_.isEmpty(errors.message) && <div className="notification error"> {errors.message} </div>}
    </Form>
  </Container>
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
