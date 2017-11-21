import React from 'react';
import { Container } from 'semantic-ui-react';

import SearchBar from './SearchBar';

const SearchPage = () => (
  <Container fluid style={{ marginTop: '51px', paddingTop: '1rem' }}>
    <SearchBar />
  </Container>
);

export default SearchPage;
