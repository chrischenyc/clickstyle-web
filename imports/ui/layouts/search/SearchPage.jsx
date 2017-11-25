import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';

import SearchBar from './SearchBar/SearchBar';
import StylistsList from './StylistsList';
import LoadMore from '../../components/LoadMore';

const SearchPage = ({
  onSearch, onLoadMore, searching, stylists, service, suburb, hasMore,
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

    {hasMore && (
      <Container textAlign="center" style={{ margin: '1rem 0' }}>
        <LoadMore searching={searching} onLoadMore={onLoadMore} />
      </Container>
    )}
  </Container>
);

SearchPage.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  service: PropTypes.string.isRequired,
  suburb: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
};

export default SearchPage;
