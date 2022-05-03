import React from 'react';

interface Props {
  children: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

export default function DialogButton(props: Props) {
  const {
    type = 'button', children, onClick, className = '',
  } = props;
  return (
    <button
      className={`shadow bg-primary-100 hover:bg-primary-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
      // eslint-disable-next-line react/button-has-type
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
