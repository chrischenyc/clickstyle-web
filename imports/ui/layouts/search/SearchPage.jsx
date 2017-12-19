import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Header, Button } from 'semantic-ui-react';

import SearchBar from '../../components/SearchBar/SearchBar';
import StylistsList from './StylistsList';
import LoadMore from '../../components/LoadMore';
import Loading from '../../components/Loading';

import { PrimaryColor } from '../../../modules/client/constants';

const SearchPage = ({
  onSearch,
  onLoadMore,
  searching,
  searched,
  stylists,
  service,
  suburb,
  postcode,
  hasMore,
  foundNothing,
}) => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <SearchBar
          onSearch={onSearch}
          searching={searching}
          service={service}
          suburb={suburb}
          postcode={postcode}
          style={{ margin: '0' }}
        />
      </div>
    </div>

    <div className="row margin-top-20">
      <div className="col-md-12">
        {searching && <Loading />}

        <StylistsList stylists={stylists} />
      </div>
    </div>

    <div className="row margin-top-50 margin-bottom-50">
      <div className="col-md-12 centered-content">
        {!searched &&
          !searching && <p>TODO: we need to display something on the empty search page</p>}

        {hasMore && (
          <div>
            <LoadMore searching={searching} onLoadMore={onLoadMore} />
          </div>
        )}

        {foundNothing && (
          <h4>
            Sorry, there are no providers that offer what you are looking for in area you selected.
          </h4>
        )}

        {searched &&
          !hasMore && (
            <div className="margin-top-25">
              <h3>Are we missing a stylist?</h3>

              <Button.Group size="large">
                <Button>Suggest a stylist</Button>
                <Button.Or />
                <Button color={PrimaryColor} as={Link} to="/join">
                  Join as a stylist
                </Button>
              </Button.Group>
            </div>
          )}
      </div>
    </div>
  </div>
);

SearchPage.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  service: PropTypes.string.isRequired,
  suburb: PropTypes.string.isRequired,
  postcode: PropTypes.string.isRequired,
  searching: PropTypes.bool.isRequired,
  searched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  foundNothing: PropTypes.bool.isRequired,
};

export default SearchPage;
