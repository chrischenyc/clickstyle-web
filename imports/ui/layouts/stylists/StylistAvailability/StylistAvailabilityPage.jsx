import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Message, Divider, Table, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';

import SideMenuContainer from '../../../components/SideMenuContainer';
import HoursDropdown from '../../../components/HoursDropdown';
import MinutesDropdown from '../../../components/MinutesDropdown';
import { dayOfWeekAsString } from '../../../../modules/format-date';

const StylistServicesPage = ({
  openHours,
  onChange,
  onSubmit,
  loading,
  saving,
  pristine,
  errors,
}) => (
  <SideMenuContainer>
    <Container>
      <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
        <Divider horizontal>regular available hours</Divider>

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
              _.sortBy(openHours, ['day']).map(openHour => (
                <Table.Row key={openHour.day}>
                  <Table.Cell>{dayOfWeekAsString(openHour.day)}</Table.Cell>

                  <Table.Cell>
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
              ))}
          </Table.Body>
        </Table>

        <Button
          color={Meteor.settings.public.semantic.color}
          size="massive"
          type="submit"
          disabled={pristine}
          loading={saving}
        >
          Save
        </Button>

        {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
      </Form>
    </Container>
  </SideMenuContainer>
);

StylistServicesPage.propTypes = {
  openHours: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired, // (day, name, value)
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
