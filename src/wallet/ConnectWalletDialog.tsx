/* eslint-disable no-console */
import React, { useContext, useState } from 'react';

import BasicDialog from '../dialog/BasicDialog';
import { NeoLineIcon } from '../icon/NeoLineIcon';
import { O3Icon } from '../icon/O3Icon';
import { OneGateIcon } from '../icon/OneGateIcon';
import { WalletConnectIcon } from '../icon/WalletConnectIcon';
import { globalContext } from '../state/Store';
import { Alert } from '../templates/commons/Alert';
import ConnectProviderButton from './ConnectProviderButton';
import { WalletProvider, Wallet, NetworkType } from './wallet';

interface Props {
  title: string;
  wallet: Wallet;
  open: boolean;
  onClose: Function;
}

export default function ConnectWalletDialog(props: Props) {
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState('');
  const { open, onClose, title } = props;
  const desiredNetwork = process.env.NEXT_PUBLIC_NETWORK as NetworkType;
  const { dispatch } = useContext(globalContext);

  function connectFailure(walletProvider: string) {
    setAlertText(`Unable to connect to ${walletProvider} - please ensure that it is available.`);
    setShowAlert(true);
  }

  function networkFailure(network: string) {
    setAlertText(
      `Connected to ${network} but expected ${desiredNetwork} - please switch to ${desiredNetwork}.`,
    );
    setShowAlert(true);
  }

  async function connectNeoLine() {
    try {
      if (await props.wallet.NeoLineAvailable) {
        const network = (await props.wallet.getNetwork(WalletProvider.NeoLine)) as NetworkType;
        if (network === desiredNetwork) {
          await props.wallet.connect(WalletProvider.NeoLine);
          const account = await props.wallet.getAccount(WalletProvider.NeoLine);
          dispatch({
            type: 'CONNECT_WALLET',
            payload: { walletAddress: account.address, walletProvider: WalletProvider.NeoLine },
          });
        } else {
          networkFailure(network);
        }
      } else {
        connectFailure('NeoLine Wallet');
      }
    } catch (e) {
      connectFailure('NeoLine Wallet');
      console.log('NeoLine not available', e);
    }
    onClose();
  }

  async function connectO3() {
    try {
      if (await props.wallet.O3Available) {
        const network = (await props.wallet.getNetwork(WalletProvider.O3)) as NetworkType;
        if (network === desiredNetwork) {
          await props.wallet.connect(WalletProvider.O3);
          const account = await props.wallet.getAccount(WalletProvider.O3);
          dispatch({
            type: 'CONNECT_WALLET',
            payload: { walletAddress: account.address, walletProvider: WalletProvider.O3 },
          });
        } else {
          networkFailure(network);
        }
      } else {
        connectFailure('O3 Wallet');
      }
    } catch (e) {
      connectFailure('O3 Wallet');
      console.log('O3 not available', e);
    }
    onClose();
  }

  async function connectWalletConnect() {
    try {
      if (await props.wallet.WalletConnectAvailable) {
        const network = (await props.wallet.getNetwork(
          WalletProvider.WalletConnect,
        )) as NetworkType;
        if (network === desiredNetwork) {
          await props.wallet.connect(WalletProvider.WalletConnect);
          const account = await props.wallet.getAccount(WalletProvider.WalletConnect);
          dispatch({
            type: 'CONNECT_WALLET',
            payload: {
              walletAddress: account.address,
              walletProvider: WalletProvider.WalletConnect,
            },
          });
        } else {
          networkFailure(network);
        }
      } else {
        connectFailure('WalletConnect');
      }
    } catch (e) {
      connectFailure('WalletConnect');
      console.log('WalletConnect not available', e);
    }
    onClose();
  }

  async function connectOneGate() {
    try {
      if (await props.wallet.OneGateAvailable) {
        const network = (await props.wallet.getNetwork(WalletProvider.OneGate)) as NetworkType;
        if (network === desiredNetwork) {
          await props.wallet.connect(WalletProvider.OneGate);
          const account = await props.wallet.getAccount(WalletProvider.OneGate);
          dispatch({
            type: 'CONNECT_WALLET',
            payload: { walletAddress: account.address, walletProvider: WalletProvider.OneGate },
          });
        } else {
          networkFailure(network);
        }
      } else {
        connectFailure('OneGate');
      }
    } catch (e) {
      connectFailure('OneGate');
      console.log('OneGate not available', e);
    }
    onClose();
  }

  if (!open) {
    if (showAlert) {
      return <Alert text={alertText} open={showAlert} onClose={() => setShowAlert(false)} />;
    }
    return <></>;
  }

  return (
    <BasicDialog open={open} onClose={onClose} canClose>
      <h2 className="text-xl text-gray-900 font-bold mb-4">{title}</h2>
      <ConnectProviderButton icon={<NeoLineIcon />} onClick={() => connectNeoLine()}>
        NeoLine Wallet
      </ConnectProviderButton>
      <ConnectProviderButton icon={<O3Icon />} onClick={() => connectO3()}>
        O3 Wallet
      </ConnectProviderButton>
      <ConnectProviderButton icon={<WalletConnectIcon />} onClick={() => connectWalletConnect()}>
        WalletConnect
      </ConnectProviderButton>
      <ConnectProviderButton icon={<OneGateIcon />} onClick={() => connectOneGate()}>
        OneGate
      </ConnectProviderButton>
    </BasicDialog>
  );
}
