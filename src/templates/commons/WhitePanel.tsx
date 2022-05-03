import React, { ReactNode } from 'react';

type IWhitePanelProps = {
  children: ReactNode;
};

const WhitePanel = (props: IWhitePanelProps) => (
  <div className="w-full flex flex-wrap bg-white text-gray-700 shadow-sm rounded-xl">
    <div className="w-full h-64 flex rounded-xl">
      {props.children}
    </div>
  </div>
);

export { WhitePanel };
