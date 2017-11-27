import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Button,
  Form,
  Message,
  Divider,
  Checkbox,
  Icon,
  Search,
  Dropdown,
} from 'semantic-ui-react';
import _ from 'lodash';

import { PrimaryColor } from '../../../../modules/client/constants';
import SideMenuContainer from '../../../components/SideMenuContainer';

class StylistServicesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {
      radius, onChange, onSubmit, loading, saving, pristine, errors,
    } = this.props;

    return (
      <SideMenuContainer>
        <Container>
          <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
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
              from<Search placeholder="suburb/postcode" style={{ display: 'inline' }} />
            </Form.Field>

            <Form.Field>
              <Checkbox label="I'm willing to travel to further regions to provide my services at an additional cost" />
            </Form.Field>

            <Button
              color={PrimaryColor}
              size="massive"
              type="submit"
              disabled={pristine || !_.isEmpty(errors)}
              loading={saving}
            >
              Save
            </Button>
            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>
        </Container>
      </SideMenuContainer>
    );
  }
}

StylistServicesPage.propTypes = {
  radius: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default StylistServicesPage;
