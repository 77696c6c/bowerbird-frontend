import React from 'react';

import { Config } from '../utils/Config';

const FooterCopyright = () => (
  <div className="footer-copyright">
    © Copyright
    {' '}
    {new Date().getFullYear()}
    {' '}
    {Config.title}
    . Powered by Neo N3
  </div>
);

export { FooterCopyright };
