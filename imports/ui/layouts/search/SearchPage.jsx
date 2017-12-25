import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Responsive } from 'semantic-ui-react';

import SearchBar from '../../components/SearchBar/SearchBar';
import StylistsListItem from './StylistsListItem';
import LoadMore from '../../components/LoadMore';
import Loading from '../../components/Loading';

const SearchPage = ({
  onLoadMore, searching, searched, stylists, hasMore, foundNothing,
}) => (
  <div className="container">
    <Responsive maxWidth={1024} className="row margin-bottom-10">
      <div className="col-md-12">
        <SearchBar />
      </div>
    </Responsive>

    <div className="row margin-top-20">
      <div className="col-md-12">{searching && <Loading />}</div>

      {stylists.map(stylist => <StylistsListItem key={stylist._id} stylist={stylist} />)}
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
            <div className="margin-top-50 margin-bottom-50">
              <h3>Are we missing a stylist?</h3>

              <Link to="/suggest" className="button border">
                Suggest a stylist
              </Link>

              <Link to="/join" className="button">
                Join as a stylist
              </Link>
            </div>
          )}
      </div>
    </div>
  </div>
);

SearchPage.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
  searched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  foundNothing: PropTypes.bool.isRequired,
};

export default SearchPage;
