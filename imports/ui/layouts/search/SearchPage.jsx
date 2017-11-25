import React from 'react';
import PropTypes from 'prop-types';
import { Container, Responsive } from 'semantic-ui-react';

import SearchBar from './SearchBar/SearchBar';
import StylistsList from './StylistsList';

const SearchPage = ({
  onSearch, searching, stylists, service, suburb,
}) => (
  <Container fluid style={{ marginTop: '51px', paddingTop: '1rem' }}>
    <Container>
      <SearchBar
        onSearch={onSearch}
        searching={searching}
        service={service}
        suburb={suburb}
        style={{ margin: '0' }}
      />
      <StylistsList stylists={stylists} />
    </Container>
  </Container>
);

SearchPage.propTypes = {
  onSearch: PropTypes.func.isRequired,
  service: PropTypes.string.isRequired,
  suburb: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
};

export default SearchPage;
