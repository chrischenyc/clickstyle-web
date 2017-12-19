import React from 'react';
import Typist from 'react-typist';

import SearchBar from '../../components/SearchBar/SearchBar';

const animatedKeywords = ['hair stylist', 'makeup artist', 'wedding'];

const HomeSearch = () => (
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
                {animatedKeywords.map(keyword => (
                  <span key={keyword}>
                    {keyword}
                    <Typist.Backspace count={keyword.length} delay={keyword.length * 50} />
                  </span>
                ))}
                <span>my style!</span>
              </Typist>
            </h4>
          </div>

          <div className="col-md-12" style={{ marginTop: '50px' }}>
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeSearch;
