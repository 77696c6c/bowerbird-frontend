import React from 'react';

interface IIconButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export default function IconButton(props: IIconButtonProps) {
  const {
    children,
    onClick = (_: React.MouseEvent<HTMLButtonElement>) => {},
    className = '',
  } = props;
  return (
    <button
      className={`focus:outline-none focus:border-none hover:bg-gray-400 hover:bg-opacity-25 p-2 rounded-full inline-flex items-center ${className}`}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
