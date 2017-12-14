import React from 'react';
import PropTypes from 'prop-types';
import Typist from 'react-typist';

import SearchBar from '../../components/SearchBar/SearchBar';

const HomeSearch = props => (
  <div
    className="main-search-container dark-overlay"
    style={{ backgroundImage: "url('images/main-search-bg.jpg')" }}
  >
    <div className="main-search-inner">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Book my personalised stylist</h2>
            <h4>
              <Typist>
                Search here for&nbsp;
                <span>hair stylist</span>
                <Typist.Backspace count={12} delay={200} />
                <span>makeup artist</span>
                <Typist.Backspace count={13} delay={200} />
                <span>my style!</span>
              </Typist>
            </h4>
          </div>

          <div className="col-md-12" style={{ marginTop: '50px' }}>
            <SearchBar onSearch={props.onSearch} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

HomeSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default HomeSearch;
