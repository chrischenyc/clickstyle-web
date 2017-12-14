import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

const ServicesList = ({ services, onSelection }) => (
  <List>
    {services.map(service => (
      <List.Item key={service._id}>
        <List.Header
          as="a"
          onClick={() => {
            onSelection(service.name);
          }}
        >
          {service.name}
        </List.Header>
        <List horizontal selection>
          {service.addons.map(addon => (
            <List.Item
              value={addon.name}
              key={addon._id}
              onClick={(event, data) => {
                onSelection(data.value);
              }}
            >
              {addon.name}
            </List.Item>
          ))}
        </List>
      </List.Item>
    ))}
  </List>
);

ServicesList.propTypes = {
  services: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired,
};

export default ServicesList;
