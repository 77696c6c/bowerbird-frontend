import React from 'react';

interface IConnectProviderButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  type?: 'submit' | 'button' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

export default function ConnectProviderButton(props: IConnectProviderButtonProps) {
  const {
    type = 'button', icon, children, onClick, className = '',
  } = props;
  return (
    <div className="md:flex justify-center">
      <button
        className={`bg-primary-100 hover:bg-primary-300 text-white font-bold py-2 px-4 my-2 w-48 rounded focus:outline-none focus:shadow-outline flex ${className}`}
        // eslint-disable-next-line react/button-has-type
        type={type}
        onClick={onClick}
      >
        <span className="flex mr-1">{icon}</span>
        <span className="flex ml-1">{children}</span>
      </button>
    </div>
  );
}
