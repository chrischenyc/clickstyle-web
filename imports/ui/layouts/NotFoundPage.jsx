import React from 'react';

import SearchBar from '../components/SearchBar/SearchBar';

const NotFoundPage = () => (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <section id="not-found" className="center">
          <p>We&apos;re sorry, but the page you were looking for doesn&apos;t exist.</p>
          <SearchBar />
        </section>
      </div>
    </div>
  </div>
);

export default NotFoundPage;
