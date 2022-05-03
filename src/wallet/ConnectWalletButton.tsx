import React from 'react';

type IConnectWalletButtonProps = {
  onClick: Function;
};

export default function ConnectWalletButton(props: IConnectWalletButtonProps) {
  const {
    onClick,
  } = props;
  return (
    <button className="shadow bg-primary-100 hover:bg-primary-300 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={() => onClick()}>
      Connect Wallet
    </button>
  );
}
