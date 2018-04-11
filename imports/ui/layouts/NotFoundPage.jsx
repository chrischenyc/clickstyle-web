import React from 'react';

import SearchBar from '../components/SearchBar/SearchBar';
import HomeHowItWorks from '../layouts/home/HomeHowItWorks';

const NotFoundPage = () => (
  <div className="container margin-bottom-50">
    <div className="row">
      <div className="col-md-12">
        <section id="not-found" className="center">
          <p>We&apos;re sorry, but the page you were looking for doesn&apos;t exist.</p>

          <p>You may try to search what you like</p>

          <SearchBar />
        </section>
      </div>
    </div>

    <div className="row">
      <div className="col-md-12">
        <HomeHowItWorks />
      </div>
    </div>
  </div>
);

export default NotFoundPage;
