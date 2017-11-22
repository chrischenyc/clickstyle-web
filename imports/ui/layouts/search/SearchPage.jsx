import React from 'react';
import PropTypes from 'prop-types';
import { Container, Responsive } from 'semantic-ui-react';

import SearchBar from './SearchBar';
import StylistsList from './StylistsList';

const SearchPage = ({ onSearch, searching, stylists }) => (
  <Container fluid style={{ marginTop: '51px', paddingTop: '1rem' }}>
    {/* search bar, use different margins on tablets and computers */}
    <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
      <SearchBar style={{ margin: '0 8px' }} onSearch={onSearch} searching={searching} />
    </Responsive>

    <Responsive minWidth={Responsive.onlyTablet.maxWidth}>
      <SearchBar style={{ margin: '0 8rem' }} onSearch={onSearch} searching={searching} />
    </Responsive>

    <StylistsList stylists={stylists} />
  </Container>
);

SearchPage.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
};

export default SearchPage;
