import React, { ReactNode } from 'react';

import { FooterIconList } from './FooterIconList';

type ICenteredFooterProps = {
  iconList: ReactNode;
};

const CenteredFooter = (props: ICenteredFooterProps) => (
  <footer className="text-center">
    <div className="m-2 flex justify-between items-center">
      <p className="mt-1 text-sm text-white">&copy; 2022 Bowerbird Finance</p>
      <FooterIconList>{props.iconList}</FooterIconList>
    </div>
  </footer>
);

export { CenteredFooter };
