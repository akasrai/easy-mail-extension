import React from 'react';

import Footer from './footer';
import Header from './header';
import { FlexRow } from './flex';
import { LayoutProps } from './layout.type';

const MainLayout = ({ children }: LayoutProps) => {
  return (
    <div style={{ width: '400px', height: '500px' }}>
      <div className="col-md-12 m-auto p-0">
        {/* <Header /> */}
        <FlexRow className="justify-content-between col-md-12 p-0">
          <div className="col-md-12 h-100 p-0">{children}</div>
        </FlexRow>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
