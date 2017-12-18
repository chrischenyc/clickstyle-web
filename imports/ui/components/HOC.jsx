import React from 'react';

import Header from './Header';
import Footer from './Footer';
import SideMenu from './SideMenu';

export const withHeaderFooter = WrappedComponent => props => (
  <div>
    <Header />
    <WrappedComponent {...props} />
    <Footer />
  </div>
);

export const withSideMenu = WrappedComponent => props => (
  <div>
    <SideMenu />
    <div className="dashboard-content">
      <Header fullContent={false} />
      <WrappedComponent {...props} />
    </div>
  </div>
);
