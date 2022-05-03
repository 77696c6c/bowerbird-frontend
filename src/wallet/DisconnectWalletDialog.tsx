import React, { useContext } from 'react';

import BasicDialog from '../dialog/BasicDialog';
import { CopyIcon } from '../icon/CopyIcon';
import { NeoLineIcon } from '../icon/NeoLineIcon';
import { O3Icon } from '../icon/O3Icon';
import { OneGateIcon } from '../icon/OneGateIcon';
import { WalletConnectIcon } from '../icon/WalletConnectIcon';
import { globalContext } from '../state/Store';
import DisconnectProviderButton from './DisconnectProviderButton';
import { Wallet, WalletProvider } from './wallet';

interface IDisconnectWalletDialogProps {
  title: string;
  wallet: Wallet;
  walletAddress: string;
  walletProvider: WalletProvider;
  open: boolean;
  onClose: Function;
}

export default function DisconnectWalletDialog(props: IDisconnectWalletDialogProps) {
  const {
    title, wallet, walletAddress, walletProvider, open, onClose,
  } = props;
  const { dispatch } = useContext(globalContext);

  const disconnectWallet = async () => {
    dispatch({ type: 'DISCONNECT_WALLET', payload: { walletAddress: '', walletProvider: '' } });
    wallet.disconnect(walletProvider);
    onClose();
  };
  let icon;
  if (walletProvider === WalletProvider.NeoLine) {
    icon = <NeoLineIcon />;
  }
  if (walletProvider === WalletProvider.O3) {
    icon = <O3Icon />;
  }
  if (walletProvider === WalletProvider.WalletConnect) {
    icon = <WalletConnectIcon />;
  }
  if (walletProvider === WalletProvider.OneGate) {
    icon = <OneGateIcon />;
  }

  window.addEventListener('NEOLine.NEO.EVENT.NETWORK_CHANGED', () => {
    disconnectWallet();
  });
  window.addEventListener('NEOLine.NEO.EVENT.ACCOUNT_CHANGED', () => {
    disconnectWallet();
  });

  if (!open) {
    return <></>;
  }

  return (
    <BasicDialog open={open} onClose={onClose} canClose>
      <h2 className="text-xl text-gray-900 font-bold mb-4">{title}</h2>
      <span className="text-gray-700 my-2 inline">{walletAddress}</span>
      {' '}
      <span>
        <CopyIcon cn="inline" onClick={() => navigator.clipboard.writeText(walletAddress)} />
      </span>
      <DisconnectProviderButton icon={icon} onClick={() => disconnectWallet()}>
        Disconnect
      </DisconnectProviderButton>
    </BasicDialog>
  );
}
