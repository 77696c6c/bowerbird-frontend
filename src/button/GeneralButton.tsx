import React from 'react';

type IGeneralButtonProps = {
  text: string;
  onClick: Function;
};

const GeneralButton = (props: IGeneralButtonProps) => (
  <button
    className="shadow bg-primary-100 hover:bg-primary-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
    type="button"
    onClick={() => props.onClick()}
  >
    {props.text}
  </button>
);

export { GeneralButton };
