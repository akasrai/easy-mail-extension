import React from 'react';

import { FlexRow } from './flex';

const Footer = () => (
  <footer>
    <FlexRow className="p-2 text-muted m-0">
      <span className="col-12 text-center small">
        &copy; {new Date().getFullYear()} Easy
        <span className="bold">Mail </span>by{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://twitter.com/akaskyiar"
        >
          Akas
        </a>
      </span>
    </FlexRow>
  </footer>
);

export default Footer;
