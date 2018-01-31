import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Responsive, Button } from 'semantic-ui-react';

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
          <h2>
            Sorry, there are no stylists that offer what you are looking for in area and time you
            selected.
          </h2>
        )}

        {searched &&
          !hasMore && (
            <div className="margin-top-50 margin-bottom-50">
              <h3>Are we missing a stylist?</h3>

              <Button.Group size="huge">
                <Button as={Link} to="/suggest-stylist">
                  Suggest a stylist
                </Button>
                <Button.Or />
                <Button color="teal" as={Link} to="/join">
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
  onLoadMore: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
  searched: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  stylists: PropTypes.array.isRequired,
  hasMore: PropTypes.bool.isRequired,
  foundNothing: PropTypes.bool.isRequired,
};

export default SearchPage;
