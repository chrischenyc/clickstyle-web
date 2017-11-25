import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Header, Button } from 'semantic-ui-react';

import SearchBar from './SearchBar/SearchBar';
import StylistsList from './StylistsList';
import LoadMore from '../../components/LoadMore';
import Loading from '../../components/Loading';

import { PrimaryColor } from '../../../modules/client/constants.js';

const SearchPage = ({
  onSearch,
  onLoadMore,
  searching,
  searched,
  stylists,
  service,
  suburb,
  hasMore,
  foundNothing,
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

    {searching && (
      <Container>
        <Loading />
      </Container>
    )}

    {hasMore && (
      <Container textAlign="center" style={{ margin: '1rem 0' }}>
        <LoadMore searching={searching} onLoadMore={onLoadMore} />
      </Container>
    )}

    {foundNothing && (
      <Container textAlign="center" style={{ margin: '1rem 0' }}>
        <p style={{ fontSize: '1.5rem' }}>
          Sorry, there are no providers that offer what you are looking for in area you selected.
        </p>
      </Container>
    )}

    {searched &&
      !hasMore && (
        <Container textAlign="center" style={{ margin: '1rem 0' }}>
          <Header>Are we missing a stylist?</Header>

          <Button.Group size="large">
            <Button>Suggest a stylist</Button>
            <Button.Or />
            <Button color={PrimaryColor} as={Link} to="/join">
              Join as a stylist
            </Button>
          </Button.Group>
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
  searched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  foundNothing: PropTypes.bool.isRequired,
};

export default SearchPage;
