import React from 'react';

type IDisconnectWalletButtonProps = {
  icon: React.ReactNode;
  walletAddress: string;
  onClick: Function;
};

export default function DisconnectWalletButton(props: IDisconnectWalletButtonProps) {
  const {
    icon,
    walletAddress,
    onClick,
  } = props;
  const addressLen = walletAddress ? walletAddress.length : 0;
  const shortAddress = addressLen > 0 ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(addressLen - 4, addressLen)}` : 'None';
  return (
    <button className="flex shadow bg-primary-100 hover:bg-primary-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={() => onClick()}>
      <span className="flex mr-1">{icon}</span>
      <span className="flex ml-1">{shortAddress}</span>
    </button>
  );
}
