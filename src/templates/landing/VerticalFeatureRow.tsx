import React, { ReactNode } from 'react';

import className from 'classnames';

type IVerticalFeatureRowProps = {
  title?: string;
  description: ReactNode;
  image?: ReactNode;
  reverse?: boolean;
};

const VerticalFeatureRow = (props: IVerticalFeatureRowProps) => {
  const verticalFeatureClass = className('my-10', 'flex', 'flex-wrap', 'items-center', {
    'flex-row-reverse': props.reverse,
  });

  return (
    <div className={verticalFeatureClass}>
      <div className="w-full sm:w-1/2 text-justify sm:px-6">
        <h3 className="text-3xl text-gray-900 font-semibold">{props.title}</h3>
        <div className="mt-6 text-xl text-gray-900 leading-9">{props.description}</div>
      </div>
      <div className="w-full sm:w-1/2 p-6 flex items-center justify-center">
        {props.image}
      </div>
    </div>
  );
};

export { VerticalFeatureRow };
