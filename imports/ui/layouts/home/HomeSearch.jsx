import React from 'react';
import Typist from 'react-typist';

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
                <span>hair stylist</span>
                <Typist.Backspace count={12} delay={200} />
                <span>makeup artist</span>
                <Typist.Backspace count={13} delay={200} />
                <span>my style!</span>
              </Typist>
            </h4>

            <div className="main-search-input">
              <div className="main-search-input-item">
                <input type="text" placeholder="Service e.g Makeup" value="" />
              </div>

              <div className="main-search-input-item location">
                <input type="text" placeholder="Suburb" value="" />
                <a href="#">
                  <i className="fa fa-dot-circle-o" />
                </a>
              </div>

              <div className="main-search-input-item location">
                <input type="text" placeholder="Any date" data-option="value" id="date-picker" />

                <a href="#">
                  <i className="fa fa-calendar" />
                </a>
              </div>

              <div className="main-search-input-item location">
                <input type="text" placeholder="Any time" data-option="value" id="date-picker" />

                <a href="#">
                  <i className="fa fa-clock-o" />
                </a>
              </div>

              <button className="button" onClick={() => {}}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeSearch;
