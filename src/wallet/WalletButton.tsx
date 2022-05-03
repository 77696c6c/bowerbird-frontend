import React from 'react';

import { NeoLineIcon } from '../icon/NeoLineIcon';
import { O3Icon } from '../icon/O3Icon';
import { OneGateIcon } from '../icon/OneGateIcon';
import { WalletConnectIcon } from '../icon/WalletConnectIcon';
import ConnectWalletButton from './ConnectWalletButton';
import DisconnectWalletButton from './DisconnectWalletButton';
import { WalletProvider } from './wallet';

type IWalletButtonProps = {
  isWalletConnected: boolean;
  walletAddress: string;
  walletProvider: WalletProvider;
  onOpenWalletConnect: Function;
  onOpenWalletDisconnect: Function;
};

/* Button and Dialogs */
const WalletButton = (props: IWalletButtonProps) => {
  let icon;
  if (props.walletProvider === WalletProvider.NeoLine) {
    icon = <NeoLineIcon />;
  }
  if (props.walletProvider === WalletProvider.O3) {
    icon = <O3Icon />;
  }
  if (props.walletProvider === WalletProvider.WalletConnect) {
    icon = <WalletConnectIcon />;
  }
  if (props.walletProvider === WalletProvider.OneGate) {
    icon = <OneGateIcon />;
  }
  const connectButton = <ConnectWalletButton onClick={() => props.onOpenWalletConnect()} />;
  const disconnectButton = (
    <DisconnectWalletButton
      icon={icon}
      walletAddress={props.walletAddress}
      onClick={() => props.onOpenWalletDisconnect()}
    />
  );

  return (
    <div className="float-right">
      {props.isWalletConnected ? disconnectButton : connectButton}
    </div>
  );
};

export { WalletButton };
