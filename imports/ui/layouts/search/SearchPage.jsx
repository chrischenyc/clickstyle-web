import React from 'react';
import { Container, Responsive } from 'semantic-ui-react';

import SearchBar from './SearchBar';

const SearchPage = () => (
  <Container fluid style={{ marginTop: '51px', paddingTop: '1rem' }}>
    <Responsive maxWidth={Responsive.onlyTablet.maxWidth}>
      <SearchBar style={{ margin: '0 8px' }} />
    </Responsive>
    <Responsive minWidth={Responsive.onlyTablet.maxWidth}>
      <SearchBar style={{ margin: '0 8rem' }} />
    </Responsive>
  </Container>
);

export default SearchPage;
